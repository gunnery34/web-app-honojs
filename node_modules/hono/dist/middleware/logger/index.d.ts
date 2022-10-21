import type { MiddlewareHandler } from '../../hono';
declare type PrintFunc = (str: string, ...rest: string[]) => void;
export declare const logger: (fn?: PrintFunc) => MiddlewareHandler;
export {};
