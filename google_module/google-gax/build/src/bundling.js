"use strict";
/*
 * Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides behavior that supports request bundling.
 */
const at = require("lodash.at");
const grpc_1 = require("grpc");
const apiCallable_1 = require("./apiCallable");
const GoogleError_1 = require("./GoogleError");
const warnings_1 = require("./warnings");
/**
 * A function which does nothing. Used for an empty cancellation funciton.
 * @private
 */
function noop() { }
/**
 * Compute the identifier of the `obj`. The objects of the same ID
 * will be bundled together.
 *
 * @param {Object} obj - The request object.
 * @param {String[]} discriminatorFields - The array of field names.
 *   A field name may include '.' as a separator, which is used to
 *   indicate object traversal.
 * @return {String|undefined} - the identifier string, or undefined if any
 *   discriminator.
 *   fields do not exist.
 */
function computeBundleId(obj, discriminatorFields) {
    const ids = [];
    let hasIds = false;
    for (let i = 0; i < discriminatorFields.length; ++i) {
        const id = at(obj, discriminatorFields[i])[0];
        if (id === undefined) {
            ids.push(null);
        }
        else {
            hasIds = true;
            ids.push(id);
        }
    }
    if (!hasIds) {
        return undefined;
    }
    return JSON.stringify(ids);
}
exports.computeBundleId = computeBundleId;
/**
 * Creates a deep copy of the object with the consideration of subresponse
 * fields for bundling.
 *
 * @param {Object} obj - The source object.
 * @param {Object?} subresponseInfo - The information to copy the subset of
 *   the field for the response. Do nothing if it's null.
 * @param {String} subresponseInfo.field - The field name.
 * @param {number} subresponseInfo.start - The offset where the copying
 *   element should starts with.
 * @param {number} subresponseInfo.end - The ending index where the copying
 *   region of the elements ends.
 * @return {Object} The copied object.
 * @private
 */
function deepCopyForResponse(
// tslint:disable-next-line no-any
obj, subresponseInfo) {
    // tslint:disable-next-line no-any
    let result;
    if (obj === null) {
        return null;
    }
    if (obj === undefined) {
        return undefined;
    }
    if (Array.isArray(obj)) {
        result = [];
        obj.forEach(element => {
            result.push(deepCopyForResponse(element, null));
        });
        return result;
    }
    // Some objects (such as ByteBuffer) have copy method.
    if (obj.copy !== undefined) {
        return obj.copy();
    }
    // ArrayBuffer should be copied through slice().
    if (obj instanceof ArrayBuffer) {
        return obj.slice(0);
    }
    if (typeof obj === 'object') {
        result = {};
        Object.keys(obj).forEach(key => {
            if (subresponseInfo && key === subresponseInfo.field &&
                Array.isArray(obj[key])) {
                // Note that subresponses are not deep-copied. This is safe because
                // those subresponses are not shared among callbacks.
                result[key] =
                    obj[key].slice(subresponseInfo.start, subresponseInfo.end);
            }
            else {
                result[key] = deepCopyForResponse(obj[key], null);
            }
        });
        return result;
    }
    return obj;
}
exports.deepCopyForResponse = deepCopyForResponse;
class Task {
    /**
     * A task coordinates the execution of a single bundle.
     *
     * @param {function} apiCall - The function to conduct calling API.
     * @param {Object} bundlingRequest - The base request object to be used
     *   for the actual API call.
     * @param {string} bundledField - The name of the field in bundlingRequest
     *   to be bundled.
     * @param {string=} subresponseField - The name of the field in the response
     *   to be passed to the callback.
     * @constructor
     * @private
     */
    constructor(apiCall, bundlingRequest, bundledField, subresponseField) {
        this._apiCall = apiCall;
        this._request = bundlingRequest;
        this._bundledField = bundledField;
        this._subresponseField = subresponseField;
        this._data = [];
    }
    /**
     * Returns the number of elements in a task.
     * @return {number} The number of elements.
     */
    getElementCount() {
        let count = 0;
        for (let i = 0; i < this._data.length; ++i) {
            count += this._data[i].elements.length;
        }
        return count;
    }
    /**
     * Returns the total byte size of the elements in a task.
     * @return {number} The byte size.
     */
    getRequestByteSize() {
        let size = 0;
        for (let i = 0; i < this._data.length; ++i) {
            size += this._data[i].bytes;
        }
        return size;
    }
    /**
     * Invokes the actual API call with current elements.
     * @return {string[]} - the list of ids for invocations to be run.
     */
    run() {
        if (this._data.length === 0) {
            return [];
        }
        const request = this._request;
        const elements = [];
        const ids = [];
        for (let i = 0; i < this._data.length; ++i) {
            elements.push.apply(elements, this._data[i].elements);
            ids.push(this._data[i].callback.id);
        }
        request[this._bundledField] = elements;
        const self = this;
        this.callCanceller =
            this._apiCall(request, (err, response) => {
                const responses = [];
                if (err) {
                    self._data.forEach(() => {
                        responses.push(null);
                    });
                }
                else {
                    let subresponseInfo = null;
                    if (self._subresponseField) {
                        subresponseInfo = {
                            field: self._subresponseField,
                            start: 0,
                        };
                    }
                    self._data.forEach(data => {
                        if (subresponseInfo) {
                            subresponseInfo.end =
                                subresponseInfo.start + data.elements.length;
                        }
                        responses.push(deepCopyForResponse(response, subresponseInfo));
                        if (subresponseInfo) {
                            subresponseInfo.start = subresponseInfo.end;
                        }
                    });
                }
                for (let i = 0; i < self._data.length; ++i) {
                    if (self._data[i].cancelled) {
                        const error = new GoogleError_1.GoogleError('cancelled');
                        error.code = grpc_1.status.CANCELLED;
                        self._data[i].callback(error);
                    }
                    else {
                        self._data[i].callback(err, responses[i]);
                    }
                }
            });
        return ids;
    }
    /**
     * Appends the list of elements into the task.
     * @param {Object[]} elements - the new list of elements.
     * @param {number} bytes - the byte size required to encode elements in the API.
     * @param {APICallback} callback - the callback of the method call.
     */
    extend(elements, bytes, callback) {
        this._data.push({
            elements,
            bytes,
            callback,
        });
    }
    /**
     * Cancels a part of elements.
     * @param {string} id - The identifier of the part of elements.
     * @return {boolean} Whether the entire task will be canceled or not.
     */
    cancel(id) {
        if (this.callCanceller) {
            let allCancelled = true;
            this._data.forEach(d => {
                if (d.callback.id === id) {
                    d.cancelled = true;
                }
                if (!d.cancelled) {
                    allCancelled = false;
                }
            });
            if (allCancelled) {
                this.callCanceller.cancel();
            }
            return allCancelled;
        }
        for (let i = 0; i < this._data.length; ++i) {
            if (this._data[i].callback.id === id) {
                const error = new GoogleError_1.GoogleError('cancelled');
                error.code = grpc_1.status.CANCELLED;
                this._data[i].callback(error);
                this._data.splice(i, 1);
                break;
            }
        }
        return this._data.length === 0;
    }
}
exports.Task = Task;
class BundleExecutor {
    /**
     * Organizes requests for an api service that requires to bundle them.
     *
     * @param {BundleOptions} bundleOptions - configures strategy this instance
     *   uses when executing bundled functions.
     * @param {BundleDescriptor} bundleDescriptor - the description of the bundling.
     * @constructor
     */
    constructor(bundleOptions, bundleDescriptor) {
        this._options = bundleOptions;
        this._descriptor = bundleDescriptor;
        this._tasks = {};
        this._timers = {};
        this._invocations = {};
        this._invocationId = 0;
    }
    /**
     * Schedule a method call.
     *
     * @param {function} apiCall - the function for an API call.
     * @param {Object} request - the request object to be bundled with others.
     * @param {APICallback} callback - the callback to be called when the method finished.
     * @return {function()} - the function to cancel the scheduled invocation.
     */
    schedule(apiCall, request, callback) {
        const bundleId = computeBundleId(request, this._descriptor.requestDiscriminatorFields);
        callback = (callback || noop);
        if (bundleId === undefined) {
            warnings_1.warn('bundling_schedule_bundleid_undefined', 'The request does not have enough information for request bundling. ' +
                `Invoking immediately. Request: ${JSON.stringify(request)} ` +
                `discriminator fields: ${this._descriptor.requestDiscriminatorFields}`);
            return apiCall(request, callback);
        }
        if (request[this._descriptor.bundledField] === undefined) {
            warnings_1.warn('bundling_no_bundled_field', `Request does not contain field ${this._descriptor.bundledField} that must present for bundling. ` +
                `Invoking immediately. Request: ${JSON.stringify(request)}`);
            return apiCall(request, callback);
        }
        if (!(bundleId in this._tasks)) {
            this._tasks[bundleId] = new Task(apiCall, request, this._descriptor.bundledField, this._descriptor.subresponseField);
        }
        let task = this._tasks[bundleId];
        callback.id = String(this._invocationId++);
        this._invocations[callback.id] = bundleId;
        const bundledField = request[this._descriptor.bundledField];
        const elementCount = bundledField.length;
        let requestBytes = 0;
        const self = this;
        bundledField.forEach(obj => {
            requestBytes += this._descriptor.byteLengthFunction(obj);
        });
        const countLimit = this._options.elementCountLimit || 0;
        const byteLimit = this._options.requestByteLimit || 0;
        if ((countLimit > 0 && elementCount > countLimit) ||
            (byteLimit > 0 && requestBytes >= byteLimit)) {
            let message;
            if (countLimit > 0 && elementCount > countLimit) {
                message = 'The number of elements ' + elementCount +
                    ' exceeds the limit ' + this._options.elementCountLimit;
            }
            else {
                message = 'The required bytes ' + requestBytes + ' exceeds the limit ' +
                    this._options.requestByteLimit;
            }
            const error = new GoogleError_1.GoogleError(message);
            error.code = grpc_1.status.INVALID_ARGUMENT;
            callback(error);
            return {
                cancel: noop,
            };
        }
        const existingCount = task.getElementCount();
        const existingBytes = task.getRequestByteSize();
        if ((countLimit > 0 && elementCount + existingCount >= countLimit) ||
            (byteLimit > 0 && requestBytes + existingBytes >= byteLimit)) {
            this._runNow(bundleId);
            this._tasks[bundleId] = new Task(apiCall, request, this._descriptor.bundledField, this._descriptor.subresponseField);
            task = this._tasks[bundleId];
        }
        task.extend(bundledField, requestBytes, callback);
        const ret = {
            cancel() {
                self._cancel(callback.id);
            },
        };
        const countThreshold = this._options.elementCountThreshold || 0;
        const sizeThreshold = this._options.requestByteThreshold || 0;
        if ((countThreshold > 0 && task.getElementCount() >= countThreshold) ||
            (sizeThreshold > 0 && task.getRequestByteSize() >= sizeThreshold)) {
            this._runNow(bundleId);
            return ret;
        }
        if (!(bundleId in this._timers) && this._options.delayThreshold > 0) {
            this._timers[bundleId] = setTimeout(() => {
                delete this._timers[bundleId];
                this._runNow(bundleId);
            }, this._options.delayThreshold);
        }
        return ret;
    }
    /**
     * Clears scheduled timeout if it exists.
     *
     * @param {String} bundleId - the id for the task whose timeout needs to be
     *   cleared.
     * @private
     */
    _maybeClearTimeout(bundleId) {
        if (bundleId in this._timers) {
            const timerId = this._timers[bundleId];
            delete this._timers[bundleId];
            clearTimeout(timerId);
        }
    }
    /**
     * Cancels an event.
     *
     * @param {String} id - The id for the event in the task.
     * @private
     */
    _cancel(id) {
        if (!(id in this._invocations)) {
            return;
        }
        const bundleId = this._invocations[id];
        if (!(bundleId in this._tasks)) {
            return;
        }
        const task = this._tasks[bundleId];
        delete this._invocations[id];
        if (task.cancel(id)) {
            this._maybeClearTimeout(bundleId);
            delete this._tasks[bundleId];
        }
    }
    /**
     * Invokes a task.
     *
     * @param {String} bundleId - The id for the task.
     * @private
     */
    _runNow(bundleId) {
        if (!(bundleId in this._tasks)) {
            warnings_1.warn('bundle_runnow_bundleid_unknown', `No such bundleid: ${bundleId}`);
            return;
        }
        this._maybeClearTimeout(bundleId);
        const task = this._tasks[bundleId];
        delete this._tasks[bundleId];
        task.run().forEach(id => {
            delete this._invocations[id];
        });
    }
}
exports.BundleExecutor = BundleExecutor;
class Bundleable extends apiCallable_1.NormalApiCaller {
    /**
     * Creates an API caller that bundles requests.
     *
     * @private
     * @constructor
     * @param {BundleExecutor} bundler - bundles API calls.
     */
    constructor(bundler) {
        super();
        this.bundler = bundler;
    }
    // tslint:disable-next-line no-any
    call(apiCall, argument, settings, status) {
        if (settings.isBundling) {
            status.call((argument, callback) => {
                this.bundler.schedule(apiCall, argument, callback);
            }, argument);
        }
        else {
            apiCallable_1.NormalApiCaller.prototype.call.call(this, apiCall, argument, settings, status);
        }
    }
}
exports.Bundleable = Bundleable;
class BundleDescriptor {
    /**
     * Describes the structure of bundled call.
     *
     * requestDiscriminatorFields may include '.' as a separator, which is used to
     * indicate object traversal. This allows fields in nested objects to be used
     * to determine what request to bundle.
     *
     * @property {String} bundledField
     * @property {String} requestDiscriminatorFields
     * @property {String} subresponseField
     * @property {Function} byteLengthFunction
     *
     * @param {String} bundledField - the repeated field in the request message
     *   that will have its elements aggregated by bundling.
     * @param {String} requestDiscriminatorFields - a list of fields in the
     *   target request message class that are used to detemrine which request
     *   messages should be bundled together.
     * @param {String} subresponseField - an optional field, when present it
     *   indicates the field in the response message that should be used to
     *   demultiplex the response into multiple response messages.
     * @param {Function} byteLengthFunction - a function to obtain the byte
     *   length to be consumed for the bundled field messages. Because Node.JS
     *   protobuf.js/gRPC uses builtin Objects for the user-visible data and
     *   internally they are encoded/decoded in protobuf manner, this function
     *   is actually necessary to calculate the byte length.
     * @constructor
     */
    constructor(bundledField, requestDiscriminatorFields, subresponseField, byteLengthFunction) {
        if (!byteLengthFunction && typeof subresponseField === 'function') {
            byteLengthFunction = subresponseField;
            subresponseField = null;
        }
        this.bundledField = bundledField;
        this.requestDiscriminatorFields = requestDiscriminatorFields;
        this.subresponseField = subresponseField;
        this.byteLengthFunction = byteLengthFunction;
    }
    /**
     * Returns a new API caller.
     * @private
     * @param {CallSettings} settings - the current settings.
     * @return {Bundleable} - the new bundling API caller.
     */
    apiCaller(settings) {
        return new Bundleable(new BundleExecutor(settings.bundleOptions, this));
    }
}
exports.BundleDescriptor = BundleDescriptor;
//# sourceMappingURL=bundling.js.map