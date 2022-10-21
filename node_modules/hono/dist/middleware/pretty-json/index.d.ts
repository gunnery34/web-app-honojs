import type { MiddlewareHandler } from '../../hono';
declare type prettyOptions = {
    space: number;
};
export declare const prettyJSON: (options?: prettyOptions) => MiddlewareHandler;
export {};
