"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegExpRouter = void 0;
const router_1 = require("../../router");
const url_1 = require("../../utils/url");
const node_1 = require("./node");
const trie_1 = require("./trie");
const METHOD_NAMES = [router_1.METHOD_NAME_ALL, ...router_1.METHODS].map((method) => method.toUpperCase());
const emptyParam = {};
const nullMatcher = [/^$/, []];
function buildWildcardRegExp(path) {
    return new RegExp(path === '*' ? '' : `^${path.replace(/\/\*/, '(?:|/.*)')}$`);
}
function buildMatcherFromPreprocessedRoutes(routes) {
    const trie = new trie_1.Trie();
    const handlers = [];
    if (routes.length === 0) {
        return nullMatcher;
    }
    for (let i = 0, len = routes.length; i < len; i++) {
        let paramMap;
        try {
            paramMap = trie.insert(routes[i][0], i);
        }
        catch (e) {
            throw e === node_1.PATH_ERROR ? new router_1.UnsupportedPathError(routes[i][0]) : e;
        }
        handlers[i] = [routes[i][1], paramMap.length !== 0 ? paramMap : null];
    }
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (let i = 0, len = handlers.length; i < len; i++) {
        const paramMap = handlers[i][1];
        if (paramMap) {
            for (let j = 0, len = paramMap.length; j < len; j++) {
                paramMap[j][1] = paramReplacementMap[paramMap[j][1]];
            }
        }
    }
    const handlerMap = [];
    // using `in` because indexReplacementMap is a sparse array
    for (const i in indexReplacementMap) {
        handlerMap[i] = handlers[indexReplacementMap[i]];
    }
    return [regexp, handlerMap];
}
function findMiddleware(middleware, path) {
    if (!middleware) {
        return undefined;
    }
    for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
        if (buildWildcardRegExp(k).test(path)) {
            return [...middleware[k]];
        }
    }
    return undefined;
}
class RegExpRouter {
    constructor() {
        this.middleware = { [router_1.METHOD_NAME_ALL]: {} };
        this.routes = { [router_1.METHOD_NAME_ALL]: {} };
    }
    add(method, path, handler) {
        var _a;
        const { middleware, routes } = this;
        if (!middleware || !routes) {
            throw new Error('Can not add a route since the matcher is already built.');
        }
        if (path === '/*') {
            path = '*';
        }
        if (/\*$/.test(path)) {
            middleware[method] || (middleware[method] = {});
            const re = buildWildcardRegExp(path);
            (_a = middleware[method])[path] || (_a[path] = findMiddleware(middleware[router_1.METHOD_NAME_ALL], path) || []);
            Object.keys(middleware).forEach((m) => {
                if (method === router_1.METHOD_NAME_ALL || method === m) {
                    Object.keys(middleware[m]).forEach((p) => {
                        ;
                        (path === '*' || path === p) && middleware[m][p].push(handler);
                    });
                }
            });
            Object.keys(routes).forEach((m) => {
                if (method === router_1.METHOD_NAME_ALL || method === m) {
                    Object.keys(routes[m]).forEach((p) => (path === '*' || re.test(p)) && routes[m][p].push(handler));
                }
            });
            return;
        }
        const paths = (0, url_1.checkOptionalParameter)(path) || [path];
        for (let i = 0, len = paths.length; i < len; i++) {
            const path = paths[i];
            routes[method] || (routes[method] = {});
            Object.keys(routes).forEach((m) => {
                var _a;
                if (method === router_1.METHOD_NAME_ALL || method === m) {
                    (_a = routes[m])[path] || (_a[path] = [
                        ...(routes[router_1.METHOD_NAME_ALL][path] ||
                            findMiddleware(middleware[method], path) ||
                            findMiddleware(middleware[router_1.METHOD_NAME_ALL], path) ||
                            []),
                    ]);
                    routes[m][path].push(handler);
                }
            });
        }
    }
    match(method, path) {
        const matchers = this.buildAllMatchers();
        this.match = (method, path) => {
            const matcher = matchers[method];
            const match = path.match(matcher[0]);
            if (!match) {
                return null;
            }
            const index = match.indexOf('', 1);
            const [handlers, paramMap] = matcher[1][index];
            if (!paramMap) {
                return { handlers, params: emptyParam };
            }
            const params = {};
            for (let i = 0, len = paramMap.length; i < len; i++) {
                params[paramMap[i][0]] = match[paramMap[i][1]];
            }
            return { handlers, params };
        };
        return this.match(method, path);
    }
    buildAllMatchers() {
        const matchers = {};
        METHOD_NAMES.forEach((method) => {
            matchers[method] = this.buildMatcher(method) || matchers[router_1.METHOD_NAME_ALL];
        });
        // Release cache
        this.middleware = this.routes = undefined;
        return matchers;
    }
    buildMatcher(method) {
        const routes = [];
        let hasOwnRoute = method === router_1.METHOD_NAME_ALL;
        [this.middleware, this.routes].forEach((r) => {
            const ownRoute = r[method]
                ? Object.keys(r[method]).map((path) => [path, r[method][path]])
                : [];
            if (ownRoute.length !== 0) {
                hasOwnRoute || (hasOwnRoute = true);
                routes.push(...ownRoute);
            }
            else if (method !== router_1.METHOD_NAME_ALL) {
                routes.push(...Object.keys(r[router_1.METHOD_NAME_ALL]).map((path) => [path, r[router_1.METHOD_NAME_ALL][path]]));
            }
        });
        if (!hasOwnRoute) {
            return null;
        }
        else {
            return buildMatcherFromPreprocessedRoutes(routes);
        }
    }
}
exports.RegExpRouter = RegExpRouter;
