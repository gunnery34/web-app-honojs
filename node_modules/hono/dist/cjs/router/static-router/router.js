"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticRouter = void 0;
const router_1 = require("../../router");
class StaticRouter {
    constructor() {
        this.middleware = {};
        this.routes = {};
        [router_1.METHOD_NAME_ALL, ...router_1.METHODS].forEach((method) => {
            this.routes[method.toUpperCase()] = {};
        });
    }
    add(method, path, handler) {
        var _a;
        const { middleware, routes } = this;
        if (path === '/*') {
            path = '*';
        }
        if (path === '*') {
            if (method === router_1.METHOD_NAME_ALL) {
                middleware[router_1.METHOD_NAME_ALL] || (middleware[router_1.METHOD_NAME_ALL] = { handlers: [], params: {} });
                Object.keys(middleware).forEach((m) => {
                    middleware[m].handlers.push(handler);
                });
                Object.keys(routes).forEach((m) => {
                    Object.values(routes[m]).forEach((matchRes) => matchRes.handlers.push(handler));
                });
            }
            else {
                middleware[method] || (middleware[method] = {
                    handlers: [...(middleware[router_1.METHOD_NAME_ALL]?.handlers || [])],
                    params: {},
                });
                middleware[method].handlers.push(handler);
                if (routes[method]) {
                    Object.values(routes[method]).forEach((matchRes) => matchRes.handlers.push(handler));
                }
            }
            return;
        }
        if (/\*|\/:/.test(path)) {
            throw new router_1.UnsupportedPathError(path);
        }
        (_a = routes[method])[path] || (_a[path] = {
            handlers: [
                ...(routes[router_1.METHOD_NAME_ALL][path]?.handlers ||
                    middleware[method]?.handlers ||
                    middleware[router_1.METHOD_NAME_ALL]?.handlers ||
                    []),
            ],
            params: {},
        });
        if (method === router_1.METHOD_NAME_ALL) {
            Object.keys(routes).forEach((m) => {
                routes[m][path]?.handlers?.push(handler);
            });
        }
        else {
            routes[method][path].handlers.push(handler);
        }
    }
    match(method, path) {
        const { routes, middleware } = this;
        this.match = (method, path) => routes[method][path] ||
            routes[router_1.METHOD_NAME_ALL][path] ||
            middleware[method] ||
            middleware[router_1.METHOD_NAME_ALL] ||
            null;
        return this.match(method, path);
    }
}
exports.StaticRouter = StaticRouter;
