"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_1 = require("./grpc");
const operationsClient = require("./operationsClient");
const routingHeader = require("./routingHeader");
exports.routingHeader = routingHeader;
var google_auth_library_1 = require("google-auth-library");
exports.GoogleAuth = google_auth_library_1.GoogleAuth;
var apiCallable_1 = require("./apiCallable");
exports.Canceller = apiCallable_1.Canceller;
exports.createApiCall = apiCallable_1.createApiCall;
var bundling_1 = require("./bundling");
exports.BundleDescriptor = bundling_1.BundleDescriptor;
exports.BundleExecutor = bundling_1.BundleExecutor;
var gax_1 = require("./gax");
exports.CallSettings = gax_1.CallSettings;
exports.constructSettings = gax_1.constructSettings;
exports.RetryOptions = gax_1.RetryOptions;
var GoogleError_1 = require("./GoogleError");
exports.GoogleError = GoogleError_1.GoogleError;
var grpc_2 = require("./grpc");
exports.ClientStub = grpc_2.ClientStub;
exports.GoogleProtoFilesRoot = grpc_2.GoogleProtoFilesRoot;
exports.GrpcClient = grpc_2.GrpcClient;
var longrunning_1 = require("./longrunning");
exports.LongrunningDescriptor = longrunning_1.LongrunningDescriptor;
exports.Operation = longrunning_1.Operation;
exports.operation = longrunning_1.operation;
var pagedIteration_1 = require("./pagedIteration");
exports.PageDescriptor = pagedIteration_1.PageDescriptor;
var pathTemplate_1 = require("./pathTemplate");
exports.PathTemplate = pathTemplate_1.PathTemplate;
var streaming_1 = require("./streaming");
exports.StreamDescriptor = streaming_1.StreamDescriptor;
exports.StreamType = streaming_1.StreamType;
function lro(options) {
    options = Object.assign({ scopes: lro.ALL_SCOPES }, options);
    const gaxGrpc = new grpc_1.GrpcClient(options);
    return new operationsClient.OperationsClientBuilder(gaxGrpc);
}
exports.lro = lro;
lro.SERVICE_ADDRESS = operationsClient.SERVICE_ADDRESS;
lro.ALL_SCOPES = operationsClient.ALL_SCOPES;
exports.createByteLengthFunction = grpc_1.GrpcClient.createByteLengthFunction;
exports.version = require('../../package.json').version;
//# sourceMappingURL=index.js.map