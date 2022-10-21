/// <reference path="request.d.ts" />
import { Hono } from './hono';
export type { Handler, Next, ContextVariableMap } from './hono';
export type { Context } from './context';
declare module './hono' {
    interface Hono {
        fire(): void;
    }
}
export { Hono };
