import type { MiddlewareHandler } from '../../hono';
declare type EncodingType = 'gzip' | 'deflate';
interface CompressionOptions {
    encoding?: EncodingType;
}
export declare const compress: (options?: CompressionOptions) => MiddlewareHandler;
export {};
