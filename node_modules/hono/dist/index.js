// @denoify-ignore
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./request.ts" /> Import "declare global" for the Request interface.
import { Hono } from './hono';
Hono.prototype.fire = function () {
    addEventListener('fetch', (event) => {
        void event.respondWith(this.handleEvent(event));
    });
};
export { Hono };
