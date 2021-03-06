/// <reference types="node" />
import { Channel } from './channel';
import { Client } from './client';
import { LogVerbosity, Status } from './constants';
import { loadPackageDefinition, makeClientConstructor } from './make-client';
import { Metadata } from './metadata';
import { StatusBuilder } from './status-builder';
export interface OAuth2Client {
    getRequestMetadata: (url: string, callback: (err: Error | null, headers?: {
        Authorization: string;
    }) => void) => void;
    getRequestHeaders: (url?: string) => Promise<{
        Authorization: string;
    }>;
}
/**** Client Credentials ****/
export declare const credentials: {
    [key: string]: Function;
};
/**** Metadata ****/
export { Metadata };
/**** Constants ****/
export { LogVerbosity as logVerbosity, Status as status };
/**** Client ****/
export { Client, loadPackageDefinition, makeClientConstructor, makeClientConstructor as makeGenericClientConstructor, Channel };
/**
 * Close a Client object.
 * @param client The client to close.
 */
export declare const closeClient: (client: Client) => void;
export declare const waitForClientReady: (client: Client, deadline: number | Date, callback: (error?: Error | undefined) => void) => void;
/**** Unimplemented function stubs ****/
export declare const loadObject: (value: any, options: any) => never;
export declare const load: (filename: any, format: any, options: any) => never;
export declare const setLogger: (logger: Partial<Console>) => void;
export declare const setLogVerbosity: (verbosity: LogVerbosity) => void;
export declare const Server: (options: any) => never;
export declare const ServerCredentials: {
    createSsl: (rootCerts: any, keyCertPairs: any, checkClientCertificate: any) => never;
    createInsecure: () => never;
};
export declare const getClientChannel: (client: Client) => Channel;
export { StatusBuilder };
export declare const ListenerBuilder: () => never;
export declare const InterceptorBuilder: () => never;
export declare const InterceptingCall: () => never;
