/// <reference types="@cloudflare/workers-types" />
import type { Context } from '../../context';
import type { Next } from '../../hono';
export declare type ServeStaticOptions = {
    root?: string;
    path?: string;
    manifest?: object | string;
    namespace?: KVNamespace;
};
export declare const serveStatic: (options?: ServeStaticOptions) => (c: Context, next: Next) => Promise<Response | undefined>;
