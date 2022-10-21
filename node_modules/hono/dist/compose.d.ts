import type { Environment, NotFoundHandler, ErrorHandler } from './hono';
interface ComposeContext {
    finalized: boolean;
    res: any;
}
export declare const compose: <C extends ComposeContext, E extends Partial<Environment> = Environment>(middleware: Function[], onNotFound?: NotFoundHandler<E> | undefined, onError?: ErrorHandler<E> | undefined) => (context: C, next?: Function) => C | Promise<C>;
export {};
