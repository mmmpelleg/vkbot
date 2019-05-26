"use strict";
/*!
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * @module commonGrpc/service
 */
const common_1 = require("@google-cloud/common");
const projectify_1 = require("@google-cloud/projectify");
const proto_loader_1 = require("@grpc/proto-loader");
const duplexify = require("duplexify");
const extend = require("extend");
const grpc = require("grpc");
const is = require("is");
const retryRequest = require("retry-request");
const through = require("through2");
// TODO: convert this object to an array
/**
 * @const {object} - A map of protobuf codes to HTTP status codes.
 * @private
 */
const GRPC_ERROR_CODE_TO_HTTP = {
    0: {
        code: 200,
        message: 'OK',
    },
    1: {
        code: 499,
        message: 'Client Closed Request',
    },
    2: {
        code: 500,
        message: 'Internal Server Error',
    },
    3: {
        code: 400,
        message: 'Bad Request',
    },
    4: {
        code: 504,
        message: 'Gateway Timeout',
    },
    5: {
        code: 404,
        message: 'Not Found',
    },
    6: {
        code: 409,
        message: 'Conflict',
    },
    7: {
        code: 403,
        message: 'Forbidden',
    },
    8: {
        code: 429,
        message: 'Too Many Requests',
    },
    9: {
        code: 412,
        message: 'Precondition Failed',
    },
    10: {
        code: 409,
        message: 'Conflict',
    },
    11: {
        code: 400,
        message: 'Bad Request',
    },
    12: {
        code: 501,
        message: 'Not Implemented',
    },
    13: {
        code: 500,
        message: 'Internal Server Error',
    },
    14: {
        code: 503,
        message: 'Service Unavailable',
    },
    15: {
        code: 500,
        message: 'Internal Server Error',
    },
    16: {
        code: 401,
        message: 'Unauthorized',
    },
};
/**
 * The default configuration for all gRPC Service instantions.
 *
 * @resource [All options]{@link
 * https://github.com/grpc/grpc/blob/13e185419cd177b7fb552601665e43820321a96b/include/grpc/impl/codegen/grpc_types.h#L148}
 *
 * @private
 *
 * @type {object}
 */
const GRPC_SERVICE_OPTIONS = {
    // RE: https://github.com/GoogleCloudPlatform/google-cloud-node/issues/1991
    'grpc.max_send_message_length': -1,
    'grpc.max_receive_message_length': -1,
    // RE: https://github.com/grpc/grpc/issues/8839
    // RE: https://github.com/grpc/grpc/issues/8382
    // RE: https://github.com/GoogleCloudPlatform/google-cloud-node/issues/1991
    'grpc.initial_reconnect_backoff_ms': 5000,
};
class ObjectToStructConverter {
    /**
     * A class that can be used to convert an object to a struct. Optionally this
     * class can be used to erase/throw on circular references during conversion.
     *
     * @private
     *
     * @param {object=} options - Configuration object.
     * @param {boolean} options.removeCircular - Remove circular references in the
     *     object with a placeholder string. (Default: `false`)
     * @param {boolean} options.stringify - Stringify un-recognized types. (Default:
     *     `false`)
     */
    constructor(options) {
        options = options || {};
        this.seenObjects = new Set();
        this.removeCircular = options.removeCircular === true;
        this.stringify = options.stringify === true;
    }
    /**
     * Begin the conversion process from a JS object to an encoded gRPC Value
     * message.
     *
     * @param {*} value - The input value.
     * @return {object} - The encoded value.
     *
     * @example
     * ObjectToStructConverter.convert({
     *   aString: 'Hi'
     * });
     * // {
     * //   fields: {
     * //     aString: {
     * //       stringValue: 'Hello!'
     * //     }
     * //   }
     * // }
     */
    convert(obj) {
        const convertedObject = {
            fields: {},
        };
        this.seenObjects.add(obj);
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                const value = obj[prop];
                if (is.undefined(value)) {
                    continue;
                }
                convertedObject.fields[prop] = this.encodeValue_(value);
            }
        }
        this.seenObjects.delete(obj);
        return convertedObject;
    }
    /**
     * Convert a raw value to a type-denoted protobuf message-friendly object.
     *
     * @private
     *
     * @param {*} value - The input value.
     * @return {*} - The encoded value.
     *
     * @example
     * ObjectToStructConverter.encodeValue('Hi');
     * // {
     * //   stringValue: 'Hello!'
     * // }
     */
    encodeValue_(value) {
        let convertedValue;
        if (is.null(value)) {
            convertedValue = {
                nullValue: 0,
            };
        }
        else if (is.number(value)) {
            convertedValue = {
                numberValue: value,
            };
        }
        else if (is.string(value)) {
            convertedValue = {
                stringValue: value,
            };
        }
        else if (is.boolean(value)) {
            convertedValue = {
                boolValue: value,
            };
        }
        else if (Buffer.isBuffer(value)) {
            convertedValue = {
                blobValue: value,
            };
        }
        else if (is.object(value)) {
            if (this.seenObjects.has(value)) {
                // Circular reference.
                if (!this.removeCircular) {
                    throw new Error([
                        'This object contains a circular reference. To automatically',
                        'remove it, set the `removeCircular` option to true.',
                    ].join(' '));
                }
                convertedValue = {
                    stringValue: '[Circular]',
                };
            }
            else {
                convertedValue = {
                    structValue: this.convert(value),
                };
            }
        }
        else if (is.array(value)) {
            convertedValue = {
                listValue: {
                    values: value.map(this.encodeValue_.bind(this)),
                },
            };
        }
        else {
            if (!this.stringify) {
                throw new Error('Value of type ' + typeof value + ' not recognized.');
            }
            convertedValue = {
                stringValue: String(value),
            };
        }
        return convertedValue;
    }
}
exports.ObjectToStructConverter = ObjectToStructConverter;
class GrpcService extends common_1.Service {
    /**
     * Service is a base class, meant to be inherited from by a "service," like
     * BigQuery or Storage.
     *
     * This handles making authenticated requests by exposing a `makeReq_`
     * function.
     *
     * @constructor
     * @alias module:common/grpc-service
     *
     * @param config - Configuration object.
     * @param {object} options - [Configuration object](#/docs/?method=gcloud).
     */
    constructor(config, options) {
        super(config, options);
        this.activeServiceMap_ = new Map();
        this.protos = {};
        if (global['GCLOUD_SANDBOX_ENV']) {
            // gRPC has a tendency to cause our doc unit tests to fail, so we prevent
            // any calls to that library from going through.
            // Reference:
            // https://github.com/GoogleCloudPlatform/google-cloud-node/pull/1137#issuecomment-193315047
            return global['GCLOUD_SANDBOX_ENV'];
        }
        if (config.customEndpoint) {
            this.grpcCredentials = grpc.credentials.createInsecure();
        }
        this.grpcMetadata = new grpc.Metadata();
        this.grpcMetadata.add('x-goog-api-client', [
            'gl-node/' + process.versions.node,
            'gccl/' + config.packageJson.version,
            'grpc/' + require('grpc/package.json').version,
        ].join(' '));
        if (config.grpcMetadata) {
            for (const prop in config.grpcMetadata) {
                if (config.grpcMetadata.hasOwnProperty(prop)) {
                    this.grpcMetadata.add(prop, config.grpcMetadata[prop]);
                }
            }
        }
        this.maxRetries = options.maxRetries;
        this.userAgent = common_1.util.getUserAgentFromPackageJson(config.packageJson);
        this.activeServiceMap_ = new Map();
        this.protos = {};
        const protoServices = config.protoServices;
        Object.keys(protoServices).forEach(name => {
            const protoConfig = protoServices[name];
            const services = this.loadProtoFile(protoConfig.path, config);
            const serviceKey = ['google', protoConfig.service, name].filter(x => x).join('.');
            const service = services[serviceKey];
            this.protos[name] = service;
            if (protoConfig.baseUrl) {
                service.baseUrl = protoConfig.baseUrl;
            }
        });
    }
    request(pOpts, rOpts, callback) {
        /**
         * The function signature above is a little funky.  This is due to the way
         * method overloading in TypeScript operates.  Since this class extends
         * Service, the signatures for `request` need to have
         * *something* in common.  The only signature actually used here is:
         *
         * request(protoOpts: ProtoOpts, reqOpts: DecorateRequestOptions, callback:
         * ServiceRequestCallback): Abortable|void;
         *
         * Hence the weird casting below.
         */
        const protoOpts = pOpts;
        let reqOpts = rOpts;
        if (global['GCLOUD_SANDBOX_ENV']) {
            return global['GCLOUD_SANDBOX_ENV'];
        }
        if (!this.grpcCredentials) {
            // We must establish an authClient to give to grpc.
            this.getGrpcCredentials_((err, credentials) => {
                if (err) {
                    callback(err);
                    return;
                }
                this.grpcCredentials = credentials;
                this.request(protoOpts, reqOpts, callback);
            });
            return;
        }
        const service = this.getService_(protoOpts);
        const metadata = this.grpcMetadata;
        const grpcOpts = {};
        if (typeof protoOpts.timeout === 'number') {
            grpcOpts.deadline = GrpcService.createDeadline_(protoOpts.timeout);
        }
        try {
            reqOpts = this.decorateRequest_(reqOpts);
        }
        catch (e) {
            callback(e);
            return;
        }
        // Retains a reference to an error from the response. If the final callback
        // is executed with this as the "response", we return it to the user as an
        // error.
        let respError;
        const retryOpts = Object.assign({
            retries: this.maxRetries,
            currentRetryAttempt: 0,
            shouldRetryFn: GrpcService.shouldRetryRequest_,
            // retry-request determines if it should retry from the incoming HTTP
            // response status. gRPC always returns an error proto message. We
            // pass that "error" into retry-request to act as the HTTP response,
            // so it can use the status code to determine if it should retry.
            request(_, onResponse) {
                respError = null;
                return service[protoOpts.method](reqOpts, metadata, grpcOpts, (err, resp) => {
                    if (err) {
                        respError = GrpcService.decorateError_(err);
                        if (respError) {
                            onResponse(null, respError);
                            return;
                        }
                        onResponse(err, resp);
                        return;
                    }
                    onResponse(null, resp);
                });
            },
        }, protoOpts.retryOpts);
        return retryRequest(null, retryOpts, (err, resp) => {
            if (!err && resp === respError) {
                err = respError;
                resp = null;
            }
            callback(err, resp);
        });
    }
    requestStream(pOpts, rOpts) {
        /**
         * The function signature above is a little funky.  This is due to the way
         * method overloading in TypeScript operates.  Since this class extends
         * Service, the signatures for `requestStream` need to have
         * *something* in common.  The only signature actually used here is:
         *
         * requestStream(protoOpts: ProtoOpts, reqOpts: DecorateRequestOptions):
         * Duplex;
         *
         * Hence the weird casting below.
         */
        if (global['GCLOUD_SANDBOX_ENV']) {
            return through.obj();
        }
        const protoOpts = pOpts;
        let reqOpts = rOpts;
        if (!protoOpts.stream) {
            protoOpts.stream = through.obj();
        }
        const stream = protoOpts.stream;
        if (!this.grpcCredentials) {
            // We must establish an authClient to give to grpc.
            this.getGrpcCredentials_((err, credentials) => {
                if (err) {
                    stream.destroy(err);
                    return;
                }
                this.grpcCredentials = credentials;
                this.requestStream(protoOpts, reqOpts);
            });
            return stream;
        }
        const objectMode = !!reqOpts.objectMode;
        const service = this.getService_(protoOpts);
        const grpcMetadata = this.grpcMetadata;
        const grpcOpts = {};
        if (typeof protoOpts.timeout === 'number') {
            grpcOpts.deadline = GrpcService.createDeadline_(protoOpts.timeout);
        }
        try {
            reqOpts = this.decorateRequest_(reqOpts);
        }
        catch (e) {
            setImmediate(() => {
                stream.destroy(e);
            });
            return stream;
        }
        const retryOpts = Object.assign({
            retries: this.maxRetries,
            currentRetryAttempt: 0,
            objectMode,
            shouldRetryFn: GrpcService.shouldRetryRequest_,
            request() {
                const ee = service[protoOpts.method](reqOpts, grpcMetadata, grpcOpts)
                    .on('metadata', () => {
                    // retry-request requires a server response before it
                    // starts emitting data. The closest mechanism grpc
                    // provides is a metadata event, but this does not provide
                    // any kind of response status. So we're faking it here
                    // with code `0` which translates to HTTP 200.
                    //
                    // https://github.com/GoogleCloudPlatform/google-cloud-node/pull/1444#discussion_r71812636
                    const grcpStatus = GrpcService.decorateStatus_({ code: 0 });
                    ee.emit('response', grcpStatus);
                });
                return ee;
            },
        }, protoOpts.retryOpts);
        // tslint:disable-next-line:no-any
        return retryRequest(null, retryOpts)
            .on('error', err => {
            const grpcError = GrpcService.decorateError_(err);
            stream.destroy(grpcError || err);
        })
            .on('request', stream.emit.bind(stream, 'request'))
            .pipe(stream);
    }
    /**
     * Make an authenticated writable streaming request with gRPC.
     *
     * @param {object} protoOpts - The proto options.
     * @param {string} protoOpts.service - The service.
     * @param {string} protoOpts.method - The method name.
     * @param {number=} protoOpts.timeout - After how many milliseconds should the
     *     request cancel.
     * @param {object} reqOpts - The request options.
     */
    requestWritableStream(protoOpts, reqOpts) {
        const stream = 
        // tslint:disable-next-line:no-any
        (protoOpts.stream = protoOpts.stream || duplexify.obj());
        if (global['GCLOUD_SANDBOX_ENV']) {
            return stream;
        }
        const self = this;
        if (!this.grpcCredentials) {
            // We must establish an authClient to give to grpc.
            this.getGrpcCredentials_((err, credentials) => {
                if (err) {
                    stream.destroy(err);
                    return;
                }
                self.grpcCredentials = credentials;
                self.requestWritableStream(protoOpts, reqOpts);
            });
            return stream;
        }
        const service = this.getService_(protoOpts);
        const grpcMetadata = this.grpcMetadata;
        const grpcOpts = {};
        if (is.number(protoOpts.timeout)) {
            grpcOpts.deadline = GrpcService.createDeadline_(protoOpts.timeout);
        }
        try {
            reqOpts = this.decorateRequest_(reqOpts);
        }
        catch (e) {
            setImmediate(() => {
                stream.destroy(e);
            });
            return stream;
        }
        const grpcStream = service[protoOpts.method](reqOpts, grpcMetadata, grpcOpts)
            .on('status', status => {
            const grcpStatus = GrpcService.decorateStatus_(status);
            stream.emit('response', grcpStatus || status);
        })
            .on('error', err => {
            const grpcError = GrpcService.decorateError_(err);
            stream.destroy(grpcError || err);
        });
        stream.setReadable(grpcStream);
        stream.setWritable(grpcStream);
        return stream;
    }
    /**
     * Decode a protobuf Struct's value.
     *
     * @param {object} value - A Struct's Field message.
     * @return {*} - The decoded value.
     */
    static decodeValue_(value) {
        switch (value.kind) {
            case 'structValue': {
                return GrpcService.structToObj_(value.structValue);
            }
            case 'nullValue': {
                return null;
            }
            case 'listValue': {
                return value.listValue.values.map(GrpcService.decodeValue_);
            }
            default: {
                return value[value.kind];
            }
        }
    }
    /**
     * Convert a raw value to a type-denoted protobuf message-friendly object.
     *
     *
     * @param {*} value - The input value.
     * @return {*} - The encoded value.
     *
     * @example
     * ObjectToStructConverter.encodeValue('Hi');
     * // {
     * //   stringValue: 'Hello!'
     * // }
     */
    static encodeValue_(value) {
        return new GrpcService.ObjectToStructConverter().encodeValue_(value);
    }
    /**
     * Creates a deadline.
     *
     * @private
     *
     * @param {number} timeout - Timeout in miliseconds.
     * @return {date} deadline - The deadline in Date object form.
     */
    static createDeadline_(timeout) {
        return new Date(Date.now() + timeout);
    }
    /**
     * Checks for a grpc status code and extends the error object with additional
     * information.
     *
     * @private
     *
     * @param {error|object} err - The grpc error.
     * @return {error|null}
     */
    static decorateError_(err) {
        const errorObj = is.error(err) ? err : {};
        return GrpcService.decorateGrpcResponse_(errorObj, err);
    }
    /**
     * Checks for a grpc status code and extends the supplied object with
     * additional information.
     *
     * @private
     *
     * @param {object} obj - The object to be extended.
     * @param {object} response - The grpc response.
     * @return {object|null}
     */
    static decorateGrpcResponse_(obj, response) {
        if (response && GRPC_ERROR_CODE_TO_HTTP[response.code]) {
            const defaultResponseDetails = GRPC_ERROR_CODE_TO_HTTP[response.code];
            let message = defaultResponseDetails.message;
            if (response.message) {
                // gRPC error messages can be either stringified JSON or strings.
                try {
                    message = JSON.parse(response.message).description;
                }
                catch (e) {
                    message = response.message;
                }
            }
            return extend(true, obj, response, {
                code: defaultResponseDetails.code,
                message,
            });
        }
        return null;
    }
    /**
     * Checks for grpc status code and extends the status object with additional
     * information
     *
     * @private
     * @param {object} status - The grpc status.
     * @return {object|null}
     */
    static decorateStatus_(status) {
        return GrpcService.decorateGrpcResponse_({}, status);
    }
    /**
     * Function to decide whether or not a request retry could occur.
     *
     * @private
     *
     * @param {object} response - The request response.
     * @return {boolean} shouldRetry
     */
    static shouldRetryRequest_(response) {
        return [429, 500, 502, 503].indexOf(response.code) > -1;
    }
    /**
     * Convert an object to a struct.
     *
     * @private
     *
     * @param {object} obj - An object to convert.
     * @param {object=} options - Configuration object.
     * @param {boolean} options.removeCircular - Remove circular references in the
     *     object with a placeholder string.
     * @param {boolean} options.stringify - Stringify un-recognized types.
     * @return {array} - The converted object.
     *
     * @example
     * GrpcService.objToStruct_({
     *   greeting: 'Hello!',
     *   favNumber: 7,
     *   friendIds: [
     *     1004,
     *     1006
     *   ],
     *   userDetails: {
     *     termsSigned: true
     *   }
     * });
     * // {
     * //   fields: {
     * //     greeting: {
     * //       stringValue: 'Hello!'
     * //     },
     * //     favNumber: {
     * //       numberValue: 7
     * //     },
     * //     friendIds: {
     * //       listValue: [
     * //         {
     * //           numberValue: 1004
     * //         },
     * //         {
     * //           numberValue: 1006
     * //         }
     * //       ]
     * //     },
     * //     userDetails: {
     * //       fields: {
     * //         termsSigned: {
     * //           booleanValue: true
     * //         }
     * //       }
     * //     }
     * //   }
     * // }
     */
    static objToStruct_(obj, options) {
        return new GrpcService.ObjectToStructConverter(options).convert(obj);
    }
    /**
     * Condense a protobuf Struct into an object of only its values.
     *
     * @private
     *
     * @param {object} struct - A protobuf Struct message.
     * @return {object} - The simplified object.
     *
     * @example
     * GrpcService.structToObj_({
     *   fields: {
     *     name: {
     *       kind: 'stringValue',
     *       stringValue: 'Stephen'
     *     }
     *   }
     * });
     * // {
     * //   name: 'Stephen'
     * // }
     */
    static structToObj_(struct) {
        const convertedObject = {};
        for (const prop in struct.fields) {
            if (struct.fields.hasOwnProperty(prop)) {
                const value = struct.fields[prop];
                convertedObject[prop] = GrpcService.decodeValue_(value);
            }
        }
        return convertedObject;
    }
    /**
     * Assign a projectId if one is specified to all request options.
     *
     * @param {object} reqOpts - The request options.
     * @return {object} - The decorated request object.
     */
    decorateRequest_(reqOpts) {
        reqOpts = Object.assign({}, reqOpts);
        delete reqOpts.autoPaginate;
        delete reqOpts.autoPaginateVal;
        delete reqOpts.objectMode;
        return projectify_1.replaceProjectIdToken(reqOpts, this.projectId);
    }
    /**
     * To authorize requests through gRPC, we must get the raw google-auth-library
     * auth client object.
     *
     * @private
     *
     * @param {function} callback - The callback function.
     * @param {?error} callback.err - An error getting an auth client.
     */
    getGrpcCredentials_(callback) {
        this.authClient.getClient().then(client => {
            const credentials = grpc.credentials.combineChannelCredentials(grpc.credentials.createSsl(), grpc.credentials.createFromGoogleCredential(client));
            if (!this.projectId || this.projectId === '{{projectId}}') {
                this.projectId = client.projectId;
            }
            callback(null, credentials);
        }, callback);
    }
    /**
     * Loads a proto file, useful when handling multiple proto files/services
     * within a single instance of GrpcService.
     *
     * @private
     *
     * @param protoConfig - The proto specific configs for this file.
     * @param config - The base config for the GrpcService.
     * @return protoObject - The loaded proto object.
     */
    loadProtoFile(protoPath, config) {
        const protoObjectCacheKey = [config.protosDir, protoPath].join('$');
        if (!GrpcService.protoObjectCache[protoObjectCacheKey]) {
            const services = proto_loader_1.loadSync(protoPath, {
                keepCase: false,
                defaults: true,
                bytes: String,
                longs: String,
                enums: String,
                oneofs: true,
                includeDirs: [config.protosDir]
            });
            GrpcService.protoObjectCache[protoObjectCacheKey] = services;
        }
        return GrpcService.protoObjectCache[protoObjectCacheKey];
    }
    /**
     * Retrieves the service object used to make the grpc requests.
     *
     * @private
     *
     * @param {object} protoOpts - The proto options.
     * @return {object} service - The proto service.
     */
    getService_(protoOpts) {
        const proto = this.protos[protoOpts.service];
        let service = this.activeServiceMap_.get(protoOpts.service);
        if (!service) {
            service = new proto[protoOpts.service](proto.baseUrl || this.baseUrl, this.grpcCredentials, Object.assign({
                'grpc.primary_user_agent': this.userAgent,
            }, GRPC_SERVICE_OPTIONS));
            this.activeServiceMap_.set(protoOpts.service, service);
        }
        return service;
    }
}
/** A cache for proto objects. */
GrpcService.protoObjectCache = {};
GrpcService.GRPC_SERVICE_OPTIONS = GRPC_SERVICE_OPTIONS;
GrpcService.GRPC_ERROR_CODE_TO_HTTP = GRPC_ERROR_CODE_TO_HTTP;
GrpcService.ObjectToStructConverter = ObjectToStructConverter;
exports.GrpcService = GrpcService;
//# sourceMappingURL=service.js.map