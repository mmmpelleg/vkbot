/**
 * Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
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
/// <reference types="node" />
import { Transform } from 'stream';
import { APICall, APICallback, NormalApiCaller, NormalApiCallerSettings } from './apiCallable';
export declare class PagedIteration extends NormalApiCaller {
    pageDescriptor: PageDescriptor;
    /**
     * Creates an API caller that returns a stream to performs page-streaming.
     *
     * @private
     * @constructor
     * @param {PageDescriptor} pageDescriptor - indicates the structure
     *   of page streaming to be performed.
     */
    constructor(pageDescriptor: PageDescriptor);
    createActualCallback(request: {
        [index: string]: {};
    }, callback: APICallback): (err: Error | null, response: {
        [index: string]: {};
    }) => void;
    wrap(func: Function): (argument: any, metadata: any, options: any, callback: any) => any;
    init(settings: NormalApiCallerSettings, callback: APICallback): import("./apiCallable").PromiseCanceller<any> | import("./apiCallable").Canceller;
    call(apiCall: APICall, argument: {
        [index: string]: {};
    }, settings: any, canceller: any): void;
}
export declare class PageDescriptor {
    requestPageTokenField: string;
    responsePageTokenField: string;
    requestPageSizeField?: string;
    resourceField: string;
    /**
     * Describes the structure of a page-streaming call.
     *
     * @property {String} requestPageTokenField
     * @property {String} responsePageTokenField
     * @property {String} resourceField
     *
     * @param {String} requestPageTokenField - The field name of the page token in
     *   the request.
     * @param {String} responsePageTokenField - The field name of the page token in
     *   the response.
     * @param {String} resourceField - The resource field name.
     *
     * @constructor
     */
    constructor(requestPageTokenField: string, responsePageTokenField: string, resourceField: string);
    /**
     * Creates a new object Stream which emits the resource on 'data' event.
     * @private
     * @param {ApiCall} apiCall - the callable object.
     * @param {Object} request - the request object.
     * @param {CallOptions=} options - the call options to customize the api call.
     * @return {Stream} - a new object Stream.
     */
    createStream(apiCall: APICall, request: any, options: any): Transform;
    /**
     * Returns a new API caller.
     * @private
     * @return {PageStreamable} - the page streaming caller.
     */
    apiCaller(): PagedIteration;
}
