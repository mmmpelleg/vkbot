"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http2 = require("http2");
const stream_1 = require("stream");
const call_credentials_1 = require("./call-credentials");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
const { HTTP2_HEADER_STATUS, HTTP2_HEADER_CONTENT_TYPE, NGHTTP2_CANCEL } = http2.constants;
var ReadState;
(function (ReadState) {
    ReadState[ReadState["NO_DATA"] = 0] = "NO_DATA";
    ReadState[ReadState["READING_SIZE"] = 1] = "READING_SIZE";
    ReadState[ReadState["READING_MESSAGE"] = 2] = "READING_MESSAGE";
})(ReadState || (ReadState = {}));
class Http2CallStream extends stream_1.Duplex {
    constructor(methodName, channel, options, filterStackFactory) {
        super({ objectMode: true });
        this.methodName = methodName;
        this.channel = channel;
        this.options = options;
        this.credentials = call_credentials_1.CallCredentials.createEmpty();
        this.http2Stream = null;
        this.pendingRead = false;
        this.pendingWrite = null;
        this.pendingWriteCallback = null;
        this.pendingFinalCallback = null;
        this.readState = ReadState.NO_DATA;
        this.readCompressFlag = Buffer.alloc(1);
        this.readPartialSize = Buffer.alloc(4);
        this.readSizeRemaining = 4;
        this.readMessageSize = 0;
        this.readPartialMessage = [];
        this.readMessageRemaining = 0;
        this.isReadFilterPending = false;
        this.canPush = false;
        this.unpushedReadMessages = [];
        this.unfilteredReadMessages = [];
        // Status code mapped from :status. To be used if grpc-status is not received
        this.mappedStatusCode = constants_1.Status.UNKNOWN;
        // Promise objects that are re-assigned to resolving promises when headers
        // or trailers received. Processing headers/trailers is asynchronous, so we
        // can use these objects to await their completion. This helps us establish
        // order of precedence when obtaining the status of the call.
        this.handlingHeaders = Promise.resolve();
        this.handlingTrailers = Promise.resolve();
        // This is populated (non-null) if and only if the call has ended
        this.finalStatus = null;
        this.filterStack = filterStackFactory.createFilter(this);
    }
    /**
     * On first call, emits a 'status' event with the given StatusObject.
     * Subsequent calls are no-ops.
     * @param status The status of the call.
     */
    endCall(status) {
        if (this.finalStatus === null) {
            this.finalStatus = status;
            this.emit('status', status);
        }
    }
    handleFilterError(error) {
        this.cancelWithStatus(constants_1.Status.INTERNAL, error.message);
    }
    handleFilteredRead(message) {
        /* If we the call has already ended, we don't want to do anything with
         * this message. Dropping it on the floor is correct behavior */
        if (this.finalStatus !== null) {
            return;
        }
        this.isReadFilterPending = false;
        if (this.canPush) {
            if (!this.push(message)) {
                this.canPush = false;
                this.http2Stream.pause();
            }
        }
        else {
            this.unpushedReadMessages.push(message);
        }
        if (this.unfilteredReadMessages.length > 0) {
            /* nextMessage is guaranteed not to be undefined because
               unfilteredReadMessages is non-empty */
            const nextMessage = this.unfilteredReadMessages.shift();
            this.filterReceivedMessage(nextMessage);
        }
    }
    filterReceivedMessage(framedMessage) {
        /* If we the call has already ended, we don't want to do anything with
         * this message. Dropping it on the floor is correct behavior */
        if (this.finalStatus !== null) {
            return;
        }
        if (framedMessage === null) {
            if (this.canPush) {
                this.push(null);
            }
            else {
                this.unpushedReadMessages.push(null);
            }
            return;
        }
        this.isReadFilterPending = true;
        this.filterStack.receiveMessage(Promise.resolve(framedMessage))
            .then(this.handleFilteredRead.bind(this), this.handleFilterError.bind(this));
    }
    tryPush(messageBytes) {
        if (this.isReadFilterPending) {
            this.unfilteredReadMessages.push(messageBytes);
        }
        else {
            this.filterReceivedMessage(messageBytes);
        }
    }
    handleTrailers(headers) {
        const code = this.mappedStatusCode;
        const details = '';
        let metadata;
        try {
            metadata = metadata_1.Metadata.fromHttp2Headers(headers);
        }
        catch (e) {
            metadata = new metadata_1.Metadata();
        }
        const status = { code, details, metadata };
        this.handlingTrailers = (async () => {
            let finalStatus;
            try {
                // Attempt to assign final status.
                finalStatus =
                    await this.filterStack.receiveTrailers(Promise.resolve(status));
            }
            catch (error) {
                await this.handlingHeaders;
                // This is a no-op if the call was already ended when handling headers.
                this.endCall({
                    code: constants_1.Status.INTERNAL,
                    details: 'Failed to process received status',
                    metadata: new metadata_1.Metadata()
                });
                return;
            }
            // It's possible that headers were received but not fully handled yet.
            // Give the headers handler an opportunity to end the call first,
            // if an error occurred.
            await this.handlingHeaders;
            // This is a no-op if the call was already ended when handling headers.
            this.endCall(finalStatus);
        })();
    }
    attachHttp2Stream(stream) {
        if (this.finalStatus !== null) {
            stream.close(NGHTTP2_CANCEL);
        }
        else {
            this.http2Stream = stream;
            stream.on('response', (headers, flags) => {
                switch (headers[HTTP2_HEADER_STATUS]) {
                    // TODO(murgatroid99): handle 100 and 101
                    case '400':
                        this.mappedStatusCode = constants_1.Status.INTERNAL;
                        break;
                    case '401':
                        this.mappedStatusCode = constants_1.Status.UNAUTHENTICATED;
                        break;
                    case '403':
                        this.mappedStatusCode = constants_1.Status.PERMISSION_DENIED;
                        break;
                    case '404':
                        this.mappedStatusCode = constants_1.Status.UNIMPLEMENTED;
                        break;
                    case '429':
                    case '502':
                    case '503':
                    case '504':
                        this.mappedStatusCode = constants_1.Status.UNAVAILABLE;
                        break;
                    default:
                        this.mappedStatusCode = constants_1.Status.UNKNOWN;
                }
                if (flags & http2.constants.NGHTTP2_FLAG_END_STREAM) {
                    this.handleTrailers(headers);
                }
                else {
                    let metadata;
                    try {
                        metadata = metadata_1.Metadata.fromHttp2Headers(headers);
                    }
                    catch (error) {
                        this.endCall({
                            code: constants_1.Status.UNKNOWN,
                            details: error.message,
                            metadata: new metadata_1.Metadata()
                        });
                        return;
                    }
                    this.handlingHeaders =
                        this.filterStack.receiveMetadata(Promise.resolve(metadata))
                            .then((finalMetadata) => {
                            this.emit('metadata', finalMetadata);
                        })
                            .catch((error) => {
                            this.destroyHttp2Stream();
                            this.endCall({
                                code: constants_1.Status.UNKNOWN,
                                details: error.message,
                                metadata: new metadata_1.Metadata()
                            });
                        });
                }
            });
            stream.on('trailers', this.handleTrailers.bind(this));
            stream.on('data', (data) => {
                let readHead = 0;
                let toRead;
                while (readHead < data.length) {
                    switch (this.readState) {
                        case ReadState.NO_DATA:
                            this.readCompressFlag = data.slice(readHead, readHead + 1);
                            readHead += 1;
                            this.readState = ReadState.READING_SIZE;
                            this.readPartialSize.fill(0);
                            this.readSizeRemaining = 4;
                            this.readMessageSize = 0;
                            this.readMessageRemaining = 0;
                            this.readPartialMessage = [];
                            break;
                        case ReadState.READING_SIZE:
                            toRead = Math.min(data.length - readHead, this.readSizeRemaining);
                            data.copy(this.readPartialSize, 4 - this.readSizeRemaining, readHead, readHead + toRead);
                            this.readSizeRemaining -= toRead;
                            readHead += toRead;
                            // readSizeRemaining >=0 here
                            if (this.readSizeRemaining === 0) {
                                this.readMessageSize = this.readPartialSize.readUInt32BE(0);
                                this.readMessageRemaining = this.readMessageSize;
                                if (this.readMessageRemaining > 0) {
                                    this.readState = ReadState.READING_MESSAGE;
                                }
                                else {
                                    this.tryPush(Buffer.concat([this.readCompressFlag, this.readPartialSize]));
                                    this.readState = ReadState.NO_DATA;
                                }
                            }
                            break;
                        case ReadState.READING_MESSAGE:
                            toRead =
                                Math.min(data.length - readHead, this.readMessageRemaining);
                            this.readPartialMessage.push(data.slice(readHead, readHead + toRead));
                            this.readMessageRemaining -= toRead;
                            readHead += toRead;
                            // readMessageRemaining >=0 here
                            if (this.readMessageRemaining === 0) {
                                // At this point, we have read a full message
                                const framedMessageBuffers = [
                                    this.readCompressFlag, this.readPartialSize
                                ].concat(this.readPartialMessage);
                                const framedMessage = Buffer.concat(framedMessageBuffers, this.readMessageSize + 5);
                                this.tryPush(framedMessage);
                                this.readState = ReadState.NO_DATA;
                            }
                            break;
                        default:
                            throw new Error('This should never happen');
                    }
                }
            });
            stream.on('end', () => {
                this.tryPush(null);
            });
            stream.on('close', async (errorCode) => {
                let code;
                let details = '';
                switch (errorCode) {
                    case http2.constants.NGHTTP2_REFUSED_STREAM:
                        code = constants_1.Status.UNAVAILABLE;
                        break;
                    case http2.constants.NGHTTP2_CANCEL:
                        code = constants_1.Status.CANCELLED;
                        break;
                    case http2.constants.NGHTTP2_ENHANCE_YOUR_CALM:
                        code = constants_1.Status.RESOURCE_EXHAUSTED;
                        details = 'Bandwidth exhausted';
                        break;
                    case http2.constants.NGHTTP2_INADEQUATE_SECURITY:
                        code = constants_1.Status.PERMISSION_DENIED;
                        details = 'Protocol not secure enough';
                        break;
                    default:
                        code = constants_1.Status.INTERNAL;
                }
                // This guarantees that if trailers were received, the value of the
                // 'grpc-status' header takes precedence for emitted status data.
                await this.handlingTrailers;
                // This is a no-op if trailers were received at all.
                // This is OK, because status codes emitted here correspond to more
                // catastrophic issues that prevent us from receiving trailers in the
                // first place.
                this.endCall({ code, details, metadata: new metadata_1.Metadata() });
            });
            stream.on('error', (err) => {
                this.endCall({
                    code: constants_1.Status.INTERNAL,
                    details: 'Internal HTTP2 error',
                    metadata: new metadata_1.Metadata()
                });
            });
            if (!this.pendingRead) {
                stream.pause();
            }
            if (this.pendingWrite) {
                if (!this.pendingWriteCallback) {
                    throw new Error('Invalid state in write handling code');
                }
                stream.write(this.pendingWrite, this.pendingWriteCallback);
            }
            if (this.pendingFinalCallback) {
                stream.end(this.pendingFinalCallback);
            }
        }
    }
    sendMetadata(metadata) {
        this.channel._startHttp2Stream(this.options.host, this.methodName, this, metadata);
    }
    destroyHttp2Stream() {
        // The http2 stream could already have been destroyed if cancelWithStatus
        // is called in response to an internal http2 error.
        if (this.http2Stream !== null && !this.http2Stream.destroyed) {
            /* TODO(murgatroid99): Determine if we want to send different RST_STREAM
             * codes based on the status code */
            this.http2Stream.close(NGHTTP2_CANCEL);
        }
    }
    cancelWithStatus(status, details) {
        this.destroyHttp2Stream();
        (async () => {
            // If trailers are currently being processed, the call should be ended
            // by handleTrailers instead.
            await this.handlingTrailers;
            this.endCall({ code: status, details, metadata: new metadata_1.Metadata() });
        })();
    }
    getDeadline() {
        return this.options.deadline;
    }
    getCredentials() {
        return this.credentials;
    }
    setCredentials(credentials) {
        this.credentials = credentials;
    }
    getStatus() {
        return this.finalStatus;
    }
    getPeer() {
        throw new Error('Not yet implemented');
    }
    getMethod() {
        return this.methodName;
    }
    getHost() {
        return this.options.host;
    }
    _read(size) {
        /* If we have already emitted a status, we should not emit any more
         * messages and we should communicate that the stream has ended */
        if (this.finalStatus !== null) {
            this.push(null);
            return;
        }
        this.canPush = true;
        if (this.http2Stream === null) {
            this.pendingRead = true;
        }
        else {
            while (this.unpushedReadMessages.length > 0) {
                const nextMessage = this.unpushedReadMessages.shift();
                this.canPush = this.push(nextMessage);
                if (nextMessage === null || (!this.canPush)) {
                    this.canPush = false;
                    return;
                }
            }
            /* Only resume reading from the http2Stream if we don't have any pending
             * messages to emit, and we haven't gotten the signal to stop pushing
             * messages */
            this.http2Stream.resume();
        }
    }
    _write(chunk, encoding, cb) {
        this.filterStack.sendMessage(Promise.resolve(chunk)).then((message) => {
            if (this.http2Stream === null) {
                this.pendingWrite = message.message;
                this.pendingWriteCallback = cb;
            }
            else {
                this.http2Stream.write(message.message, cb);
            }
        }, this.handleFilterError.bind(this));
    }
    _final(cb) {
        if (this.http2Stream === null) {
            this.pendingFinalCallback = cb;
        }
        else {
            this.http2Stream.end(cb);
        }
    }
}
exports.Http2CallStream = Http2CallStream;
//# sourceMappingURL=call-stream.js.map