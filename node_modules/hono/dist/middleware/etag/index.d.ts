import type { MiddlewareHandler } from '../../hono';
declare type ETagOptions = {
    weak: boolean;
};
export declare const etag: (options?: ETagOptions) => MiddlewareHandler;
export {};
