"use strict";
/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const protobuf = require("protobufjs");
const walk = require("walkdir");
let COMMON_PROTO_FILES;
class GoogleProtoFilesRoot extends protobuf.Root {
    constructor(options) {
        super(options);
    }
    // Caches and returns an array of the local common/google core proto files
    // exist on disk.
    static getCommonProtoFiles() {
        const commonProtoDirs = [
            // This list of directories is defined here:
            // https://github.com/googleapis/googleapis/blob/master/gapic/packaging/common_protos.yaml
            'api',
            path.join('logging', 'type'),
            'longrunning',
            'protobuf',
            // on.
            'rpc',
            'type',
        ].map(dir => path.join(__dirname, '../../', 'google', dir));
        if (!COMMON_PROTO_FILES) {
            COMMON_PROTO_FILES = commonProtoDirs
                .map(dir => {
                return walk.sync(dir)
                    .filter(f => path.extname(f) === '.proto')
                    .map(path.normalize);
            })
                .reduce((a, c) => a.concat(c), []);
        }
        return COMMON_PROTO_FILES;
    }
    // Causes the loading of an included proto to check if it is a common
    // proto. If it is a common proto, use the google-proto-files proto.
    resolvePath(_, includePath, alreadyNormalized) {
        includePath = path.normalize(includePath);
        // Fully qualified paths don't need to be resolved.
        if (path.isAbsolute(includePath)) {
            return includePath;
        }
        const fullIncludePath = path.join(__dirname, path.relative(__dirname, includePath));
        const commonProtoFiles = GoogleProtoFilesRoot.getCommonProtoFiles();
        if (commonProtoFiles.indexOf(fullIncludePath) > -1) {
            return fullIncludePath;
        }
        return protobuf.util.path.resolve(_, includePath, alreadyNormalized);
    }
}
exports.GoogleProtoFilesRoot = GoogleProtoFilesRoot;
function loadSync(filename, options) {
    const root = new GoogleProtoFilesRoot();
    return root.loadSync(filename, options);
}
exports.loadSync = loadSync;
function load(filename, options) {
    const root = new GoogleProtoFilesRoot();
    return root.load(filename, options);
}
exports.load = load;
//# sourceMappingURL=load.js.map