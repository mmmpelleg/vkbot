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
 * @module commonGrpc/serviceObject
 */
const common_1 = require("@google-cloud/common");
const promisify_1 = require("@google-cloud/promisify");
const extend = require("extend");
class GrpcServiceObject extends common_1.ServiceObject {
    /**
     * GrpcServiceObject is a base class, meant to be inherited from by a service
     * object that uses the gRPC protobuf API.
     *
     * @constructor
     * @alias module:common/grpc-service-object
     *
     * @private
     *
     * @param {object} config - Configuration object.
     */
    constructor(config) {
        super(config);
    }
    delete(callback) {
        // tslint:disable-next-line:no-any
        const protoOpts = this.methods.delete.protoOpts;
        const reqOpts = this.getOpts(this.methods.delete);
        this.request(protoOpts, reqOpts, callback || common_1.util.noop);
    }
    getMetadata(callback) {
        // tslint:disable-next-line:no-any
        const protoOpts = this.methods.getMetadata.protoOpts;
        const reqOpts = this.getOpts(this.methods.getMetadata);
        this.request(protoOpts, reqOpts, (err, resp) => {
            if (err) {
                callback(err, null, resp);
                return;
            }
            this.metadata = resp;
            callback(null, this.metadata, resp);
        });
    }
    setMetadata(metadata, callback) {
        // tslint:disable-next-line:no-any
        const protoOpts = this.methods.setMetadata.protoOpts;
        const reqOpts = extend(true, {}, this.getOpts(this.methods.setMetadata), metadata);
        this.request(protoOpts, reqOpts, callback || common_1.util.noop);
    }
    /**
     * Patch a request to the GrpcService object.
     *
     * @private
     */
    request(...args) {
        return this.parent.request.apply(this.parent, args);
    }
    /**
     * Patch a streaming request to the GrpcService object.
     *
     * @private
     */
    requestStream(...args) {
        return this.parent.requestStream.apply(this.parent, args);
    }
    /**
     * Patch a writable streaming request to the GrpcService object.
     *
     * @private
     */
    requestWritableStream(...args) {
        // tslint:disable-next-line:no-any
        return this.parent.requestWritableStream.apply(this.parent, args);
    }
    getOpts(metadata) {
        return typeof metadata === 'boolean' ? {} : metadata.reqOpts || {};
    }
}
exports.GrpcServiceObject = GrpcServiceObject;
/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisify_1.promisifyAll(GrpcServiceObject);
//# sourceMappingURL=service-object.js.map