import type { MiddlewareHandler } from '../../hono';
export declare const cache: (options: {
    cacheName: string;
    wait?: boolean;
    cacheControl?: string;
}) => MiddlewareHandler;
