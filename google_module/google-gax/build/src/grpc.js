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
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpcProtoLoaderTypes = require("@grpc/proto-loader"); // for types only
const fs = require("fs");
const google_auth_library_1 = require("google-auth-library");
const google_proto_files_1 = require("google-proto-files");
const grpcTypes = require("grpc"); // for types only
const grpcGcp = require("grpc-gcp");
const path = require("path");
const protobuf = require("protobufjs");
const semver = require("semver");
const walk = require("walkdir");
const gax = require("./gax");
const googleProtoFilesDir = path.normalize(google_proto_files_1.getProtoPath('..'));
// INCLUDE_DIRS is passed to @grpc/proto-loader
const INCLUDE_DIRS = [];
INCLUDE_DIRS.push(googleProtoFilesDir);
// COMMON_PROTO_FILES logic is here for protobufjs loads (see
// GoogleProtoFilesRoot below)
const COMMON_PROTO_DIRS = [
    // This list of directories is defined here:
    // https://github.com/googleapis/googleapis/blob/master/gapic/packaging/common_protos.yaml
    'api',
    path.join('iam', 'v1'),
    path.join('logging', 'type'),
    path.join('monitoring', 'v3'),
    'longrunning',
    'protobuf',
    'rpc',
    'type',
].map(dir => path.join(googleProtoFilesDir, 'google', dir));
INCLUDE_DIRS.push(...COMMON_PROTO_DIRS);
const COMMON_PROTO_FILES = COMMON_PROTO_DIRS
    .map(dir => {
    return walk.sync(dir)
        .filter(f => path.extname(f) === '.proto')
        .map(f => path.normalize(f).substring(googleProtoFilesDir.length + 1));
})
    .reduce((a, c) => a.concat(c), []);
class ClientStub extends grpcTypes.Client {
}
exports.ClientStub = ClientStub;
class GrpcClient {
    /**
     * A class which keeps the context of gRPC and auth for the gRPC.
     *
     * @param {Object=} options - The optional parameters. It will be directly
     *   passed to google-auth-library library, so parameters like keyFile or
     *   credentials will be valid.
     * @param {Object=} options.auth - An instance of google-auth-library.
     *   When specified, this auth instance will be used instead of creating
     *   a new one.
     * @param {Object=} options.grpc - When specified, this will be used
     *   for the 'grpc' module in this context. By default, it will load the grpc
     *   module in the standard way.
     * @param {Function=} options.promise - A constructor for a promise that
     * implements the ES6 specification of promise. If not provided, native
     * promises will be used.
     * @constructor
     */
    constructor(options = {}) {
        this.auth = options.auth || new google_auth_library_1.GoogleAuth(options);
        this.promise = options.promise || Promise;
        if ('grpc' in options) {
            this.grpc = options.grpc;
            this.grpcVersion = '';
        }
        else {
            // EXPERIMENTAL: If GOOGLE_CLOUD_USE_GRPC_JS is set, use the JS-based
            // implementation of the gRPC client instead. Requires http2 (Node 8+).
            if (semver.gte(process.version, '8.13.0') &&
                !!process.env.GOOGLE_CLOUD_USE_GRPC_JS) {
                this.grpc = require('@grpc/grpc-js');
                this.grpc.isLegacy = false;
                this.grpcVersion = require('@grpc/grpc-js/package.json').version;
            }
            else {
                this.grpc = require('grpc');
                this.grpc.isLegacy = true;
                this.grpcVersion = require('grpc/package.json').version;
            }
        }
        this.grpcProtoLoader = require('@grpc/proto-loader');
    }
    /**
     * Creates a gRPC credentials. It asks the auth data if necessary.
     * @private
     * @param {Object} opts - options values for configuring credentials.
     * @param {Object=} opts.sslCreds - when specified, this is used instead
     *   of default channel credentials.
     * @return {Promise} The promise which will be resolved to the gRPC credential.
     */
    _getCredentials(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (opts.sslCreds) {
                return opts.sslCreds;
            }
            const grpc = this.grpc;
            const sslCreds = grpc.credentials.createSsl();
            const client = yield this.auth.getClient();
            const credentials = grpc.credentials.combineChannelCredentials(sslCreds, grpc.credentials.createFromGoogleCredential(client));
            return credentials;
        });
    }
    /**
     * Loads the gRPC service from the proto file at the given path and with the
     * given options.
     * @param filename The path to the proto file.
     * @param options Options for loading the proto file.
     */
    loadFromProto(filename, options) {
        const packageDef = grpcProtoLoaderTypes.loadSync(filename, options);
        return this.grpc.loadPackageDefinition(packageDef);
    }
    /**
     * Load grpc proto service from a filename hooking in googleapis common protos
     * when necessary. Uses legacy grpc.loadObject.
     * @param {String} protoPath - The directory to search for the protofile.
     * @param {String} filename - The filename of the proto to be loaded.
     * @return {Object<string, *>} The gRPC loaded result (the toplevel namespace
     *   object).
     */
    loadProtoLegacy(protoPath, filename) {
        const resolvedPath = GrpcClient._resolveFile(protoPath, filename);
        const retval = this.grpc.loadObject(protobuf.loadSync(resolvedPath, new GoogleProtoFilesRoot()));
        return retval;
    }
    /**
     * Load grpc proto service from a filename hooking in googleapis common protos
     * when necessary. Uses the new shiny @grpc/proto-loader.
     * @param {String} protoPath - The directory to search for the protofile.
     * @param {String} filename - The filename of the proto to be loaded.
     * @return {Object<string, *>} The gRPC loaded result (the toplevel namespace
     *   object).
     */
    loadProtoGrpcJs(protoPath, filename) {
        // This set of @grpc/proto-loader options
        // 'closely approximates the existing behavior of grpc.load'
        const includeDirs = INCLUDE_DIRS.slice();
        includeDirs.unshift(protoPath);
        const options = {
            keepCase: false,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs
        };
        return this.loadFromProto(filename, options);
    }
    /**
     * Load grpc proto service from a filename hooking in googleapis common protos
     * when necessary. Can use either legacy grpc.loadProto, or new
     * @grpc/proto-loader, depending on which gRPC backend is used.
     * @param {String} protoPath - The directory to search for the protofile.
     * @param {String} filename - The filename of the proto to be loaded.
     * @return {Object<string, *>} The gRPC loaded result (the toplevel namespace
     *   object).
     */
    loadProto(protoPath, filename) {
        return this.grpc.isLegacy ? this.loadProtoLegacy(protoPath, filename) :
            this.loadProtoGrpcJs(protoPath, filename);
    }
    static _resolveFile(protoPath, filename) {
        if (fs.existsSync(path.join(protoPath, filename))) {
            return path.join(protoPath, filename);
        }
        else if (COMMON_PROTO_FILES.indexOf(filename) > -1) {
            return path.join(googleProtoFilesDir, filename);
        }
        throw new Error(filename + ' could not be found in ' + protoPath);
    }
    metadataBuilder(headers) {
        const Metadata = this.grpc.Metadata;
        const baseMetadata = new Metadata();
        // tslint:disable-next-line forin
        for (const key in headers) {
            const value = headers[key];
            if (Array.isArray(value)) {
                value.forEach(v => baseMetadata.add(key, v));
            }
            else {
                baseMetadata.set(key, `${value}`);
            }
        }
        return function buildMetadata(abTests, moreHeaders) {
            // TODO: bring the A/B testing info into the metadata.
            let copied = false;
            let metadata = baseMetadata;
            if (moreHeaders) {
                for (const key in moreHeaders) {
                    if (key.toLowerCase() !== 'x-goog-api-client' &&
                        moreHeaders.hasOwnProperty(key)) {
                        if (!copied) {
                            copied = true;
                            metadata = metadata.clone();
                        }
                        const value = moreHeaders[key];
                        if (Array.isArray(value)) {
                            value.forEach(v => metadata.add(key, v));
                        }
                        else {
                            metadata.set(key, `${value}`);
                        }
                    }
                }
            }
            return metadata;
        };
    }
    /**
     * A wrapper of {@link constructSettings} function under the gRPC context.
     *
     * Most of parameters are common among constructSettings, please take a look.
     * @param {string} serviceName - The fullly-qualified name of the service.
     * @param {Object} clientConfig - A dictionary of the client config.
     * @param {Object} configOverrides - A dictionary of overriding configs.
     * @param {Object} headers - A dictionary of additional HTTP header name to
     *   its value.
     * @return {Object} A mapping of method names to CallSettings.
     */
    constructSettings(serviceName, clientConfig, configOverrides, headers) {
        return gax.constructSettings(serviceName, clientConfig, configOverrides, this.grpc.status, { metadataBuilder: this.metadataBuilder(headers) }, this.promise);
    }
    /**
     * Creates a gRPC stub with current gRPC and auth.
     * @param {function} CreateStub - The constructor function of the stub.
     * @param {Object} options - The optional arguments to customize
     *   gRPC connection. This options will be passed to the constructor of
     *   gRPC client too.
     * @param {string} options.servicePath - The name of the server of the service.
     * @param {number} options.port - The port of the service.
     * @param {grpcTypes.ClientCredentials=} options.sslCreds - The credentials to be used
     *   to set up gRPC connection.
     * @return {Promise} A promse which resolves to a gRPC stub instance.
     */
    // tslint:disable-next-line variable-name
    createStub(CreateStub, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceAddress = options.servicePath + ':' + options.port;
            const creds = yield this._getCredentials(options);
            const grpcOptions = {};
            Object.keys(options).forEach(key => {
                if (key.indexOf('grpc.') === 0) {
                    grpcOptions[key] = options[key];
                }
            });
            const apiConfigDefinition = options['grpc_gcp.apiConfig'];
            if (apiConfigDefinition) {
                const apiConfig = grpcGcp.createGcpApiConfig(apiConfigDefinition);
                grpcOptions['channelFactoryOverride'] = grpcGcp.gcpChannelFactoryOverride;
                grpcOptions['callInvocationTransformer'] =
                    grpcGcp.gcpCallInvocationTransformer;
                grpcOptions['gcpApiConfig'] = apiConfig;
            }
            const stub = new CreateStub(serviceAddress, creds, grpcOptions);
            return stub;
        });
    }
    /**
     * Creates a 'bytelength' function for a given proto message class.
     *
     * See {@link BundleDescriptor} about the meaning of the return value.
     *
     * @param {function} message - a constructor function that is generated by
     *   protobuf.js. Assumes 'encoder' field in the message.
     * @return {function(Object):number} - a function to compute the byte length
     *   for an object.
     */
    static createByteLengthFunction(message) {
        return function getByteLength(obj) {
            return message.encode(obj).finish().length;
        };
    }
}
exports.GrpcClient = GrpcClient;
class GoogleProtoFilesRoot extends protobuf.Root {
    constructor(...args) {
        super(...args);
    }
    // Causes the loading of an included proto to check if it is a common
    // proto. If it is a common proto, use the google-proto-files proto.
    resolvePath(originPath, includePath) {
        originPath = path.normalize(originPath);
        includePath = path.normalize(includePath);
        // Fully qualified paths don't need to be resolved.
        if (path.isAbsolute(includePath)) {
            if (!fs.existsSync(includePath)) {
                throw new Error('The include `' + includePath + '` was not found.');
            }
            return includePath;
        }
        if (COMMON_PROTO_FILES.indexOf(includePath) > -1) {
            return path.join(googleProtoFilesDir, includePath);
        }
        return GoogleProtoFilesRoot._findIncludePath(originPath, includePath);
    }
    static _findIncludePath(originPath, includePath) {
        originPath = path.normalize(originPath);
        includePath = path.normalize(includePath);
        let current = originPath;
        let found = fs.existsSync(path.join(current, includePath));
        while (!found && current.length > 0) {
            current = current.substring(0, current.lastIndexOf(path.sep));
            found = fs.existsSync(path.join(current, includePath));
        }
        if (!found) {
            throw new Error('The include `' + includePath + '` was not found.');
        }
        return path.join(current, includePath);
    }
}
exports.GoogleProtoFilesRoot = GoogleProtoFilesRoot;
//# sourceMappingURL=grpc.js.map