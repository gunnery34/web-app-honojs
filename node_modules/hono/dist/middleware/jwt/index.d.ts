import type { MiddlewareHandler } from '../../hono';
export declare const jwt: (options: {
    secret: string;
    cookie?: string;
    alg?: string;
}) => MiddlewareHandler;
