/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */
import * as protobuf from 'protobufjs';
export interface GoogleProtoFilesRootOptions {
    [index: string]: any;
}
export declare class GoogleProtoFilesRoot extends protobuf.Root {
    constructor(options?: GoogleProtoFilesRootOptions);
    static getCommonProtoFiles(): string[];
    resolvePath(_: string, includePath: string, alreadyNormalized?: boolean): string;
}
export declare function loadSync(filename: string, options?: protobuf.IParseOptions): protobuf.Root;
export declare function load(filename: string, options?: protobuf.IParseOptions): Promise<protobuf.Root>;
