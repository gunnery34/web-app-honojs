import type { MiddlewareHandler } from '../../hono';
export declare const bearerAuth: (options: {
    token: string;
    realm?: string;
    prefix?: string;
    hashFunction?: Function;
}) => MiddlewareHandler;
