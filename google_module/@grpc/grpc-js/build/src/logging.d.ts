/// <reference types="node" />
import { LogVerbosity } from './constants';
export declare const getLogger: () => Partial<Console>;
export declare const setLogger: (logger: Partial<Console>) => void;
export declare const setLoggerVerbosity: (verbosity: LogVerbosity) => void;
export declare const log: (severity: LogVerbosity, ...args: any[]) => void;
