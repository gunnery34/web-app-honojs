import type { Router, Result } from '../../router';
export declare class StaticRouter<T> implements Router<T> {
    middleware: Record<string, Result<T>>;
    routes: Record<string, Record<string, Result<T>>>;
    constructor();
    add(method: string, path: string, handler: T): void;
    match(method: string, path: string): Result<T> | null;
}
