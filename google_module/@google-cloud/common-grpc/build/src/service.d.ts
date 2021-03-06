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
/// <reference types="node" />
/*!
 * @module commonGrpc/service
 */
import { Abortable, BodyResponseCallback, DecorateRequestOptions, Service, ServiceConfig } from '@google-cloud/common';
import * as grpc from 'grpc';
import * as r from 'request';
import * as retryRequest from 'retry-request';
import { Duplex } from 'stream';
export interface ServiceRequestCallback {
    (err: Error | null, apiResponse?: r.Response): void;
}
export interface ProtoOpts {
    service: string;
    method: string;
    timeout?: number;
    retryOpts?: retryRequest.Options;
    stream?: Duplex;
}
/**
 * Configuration object for GrpcService.
 */
export interface GrpcServiceConfig extends ServiceConfig {
    /** Metadata to send with every request. */
    grpcMetadata: grpc.Metadata;
    /** The root directory where proto files live. */
    protosDir: string;
    /**
     * Directly provide the required proto files. This is useful when a single
     * class requires multiple services.
     */
    protoServices: {
        [serviceName: string]: {
            path: string;
            service: string;
            baseUrl: string;
        };
    };
    customEndpoint: boolean;
}
export interface ObjectToStructConverterConfig {
    removeCircular?: boolean;
    stringify?: boolean;
}
export declare class ObjectToStructConverter {
    seenObjects: Set<{}>;
    removeCircular: boolean;
    stringify?: boolean;
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
    constructor(options?: ObjectToStructConverterConfig);
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
    convert(obj: {}): {
        fields: {};
    };
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
    encodeValue_(value: {}): any;
}
export declare class GrpcService extends Service {
    grpcCredentials?: {};
    grpcMetadata?: {
        add: Function;
    };
    maxRetries?: number;
    userAgent?: string;
    activeServiceMap_: Map<any, any>;
    protos: {};
    /** A cache for proto objects. */
    private static protoObjectCache;
    static readonly GRPC_SERVICE_OPTIONS: {
        'grpc.max_send_message_length': number;
        'grpc.max_receive_message_length': number;
        'grpc.initial_reconnect_backoff_ms': number;
    };
    static readonly GRPC_ERROR_CODE_TO_HTTP: {
        0: {
            code: number;
            message: string;
        };
        1: {
            code: number;
            message: string;
        };
        2: {
            code: number;
            message: string;
        };
        3: {
            code: number;
            message: string;
        };
        4: {
            code: number;
            message: string;
        };
        5: {
            code: number;
            message: string;
        };
        6: {
            code: number;
            message: string;
        };
        7: {
            code: number;
            message: string;
        };
        8: {
            code: number;
            message: string;
        };
        9: {
            code: number;
            message: string;
        };
        10: {
            code: number;
            message: string;
        };
        11: {
            code: number;
            message: string;
        };
        12: {
            code: number;
            message: string;
        };
        13: {
            code: number;
            message: string;
        };
        14: {
            code: number;
            message: string;
        };
        15: {
            code: number;
            message: string;
        };
        16: {
            code: number;
            message: string;
        };
    };
    static readonly ObjectToStructConverter: typeof ObjectToStructConverter;
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
    constructor(config: GrpcServiceConfig, options: any);
    /**
     * Make an authenticated request with gRPC.
     *
     * @param {object} protoOpts - The proto options.
     * @param {string} protoOpts.service - The service name.
     * @param {string} protoOpts.method - The method name.
     * @param {number=} protoOpts.timeout - After how many milliseconds should the
     *     request cancel.
     * @param {object} reqOpts - The request options.
     * @param {function=} callback - The callback function.
     */
    request(reqOpts: DecorateRequestOptions): Promise<r.Response>;
    request(reqOpts: DecorateRequestOptions, callback: BodyResponseCallback): void;
    request(reqOpts: DecorateRequestOptions, callback?: BodyResponseCallback): void | Promise<r.Response>;
    request(protoOpts: ProtoOpts, reqOpts: DecorateRequestOptions, callback: ServiceRequestCallback): Abortable | void;
    /**
     * Make an authenticated streaming request with gRPC.
     *
     * @param {object} protoOpts - The proto options.
     * @param {string} protoOpts.service - The service.
     * @param {string} protoOpts.method - The method name.
     * @param {number=} protoOpts.timeout - After how many milliseconds should the
     *     request cancel.
     * @param {object} reqOpts - The request options.
     */
    requestStream(reqOpts: DecorateRequestOptions): r.Request;
    requestStream(protoOpts: ProtoOpts, reqOpts: DecorateRequestOptions): Duplex;
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
    requestWritableStream(protoOpts: any, reqOpts: any): any;
    /**
     * Decode a protobuf Struct's value.
     *
     * @param {object} value - A Struct's Field message.
     * @return {*} - The decoded value.
     */
    static decodeValue_(value: any): any;
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
    static encodeValue_(value: any): any;
    /**
     * Creates a deadline.
     *
     * @private
     *
     * @param {number} timeout - Timeout in miliseconds.
     * @return {date} deadline - The deadline in Date object form.
     */
    private static createDeadline_;
    /**
     * Checks for a grpc status code and extends the error object with additional
     * information.
     *
     * @private
     *
     * @param {error|object} err - The grpc error.
     * @return {error|null}
     */
    static decorateError_(err: Error): Error | null;
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
    private static decorateGrpcResponse_;
    /**
     * Checks for grpc status code and extends the status object with additional
     * information
     *
     * @private
     * @param {object} status - The grpc status.
     * @return {object|null}
     */
    private static decorateStatus_;
    /**
     * Function to decide whether or not a request retry could occur.
     *
     * @private
     *
     * @param {object} response - The request response.
     * @return {boolean} shouldRetry
     */
    private static shouldRetryRequest_;
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
    private static objToStruct_;
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
    private static structToObj_;
    /**
     * Assign a projectId if one is specified to all request options.
     *
     * @param {object} reqOpts - The request options.
     * @return {object} - The decorated request object.
     */
    decorateRequest_(reqOpts: any): any;
    /**
     * To authorize requests through gRPC, we must get the raw google-auth-library
     * auth client object.
     *
     * @private
     *
     * @param {function} callback - The callback function.
     * @param {?error} callback.err - An error getting an auth client.
     */
    private getGrpcCredentials_;
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
    private loadProtoFile;
    /**
     * Retrieves the service object used to make the grpc requests.
     *
     * @private
     *
     * @param {object} protoOpts - The proto options.
     * @return {object} service - The proto service.
     */
    private getService_;
}
