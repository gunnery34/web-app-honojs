"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonoContext = void 0;
const cookie_1 = require("./utils/cookie");
class HonoContext {
    constructor(req, env = undefined, executionCtx = undefined, notFoundHandler = () => new Response()) {
        this.error = undefined;
        this._status = 200;
        this._pretty = false;
        this._prettySpace = 2;
        this._executionCtx = executionCtx;
        this.req = req;
        this.env = env || {};
        this.notFoundHandler = notFoundHandler;
        this.finalized = false;
    }
    get event() {
        if (this._executionCtx instanceof FetchEvent) {
            return this._executionCtx;
        }
        else {
            throw Error('This context has no FetchEvent');
        }
    }
    get executionCtx() {
        if (this._executionCtx) {
            return this._executionCtx;
        }
        else {
            throw Error('This context has no ExecutionContext');
        }
    }
    get res() {
        return (this._res || (this._res = new Response('404 Not Found', { status: 404 })));
    }
    set res(_res) {
        this._res = _res;
        this.finalized = true;
    }
    header(name, value, options) {
        this._headers || (this._headers = {});
        const key = name.toLowerCase();
        let shouldAppend = false;
        if (options && options.append) {
            const vAlreadySet = this._headers[key];
            if (vAlreadySet && vAlreadySet.length) {
                shouldAppend = true;
            }
        }
        if (shouldAppend) {
            this._headers[key].push(value);
        }
        else {
            this._headers[key] = [value];
        }
        if (this.finalized) {
            if (shouldAppend) {
                this.res.headers.append(name, value);
            }
            else {
                this.res.headers.set(name, value);
            }
        }
    }
    status(status) {
        this._status = status;
    }
    set(key, value) {
        this._map || (this._map = {});
        this._map[key] = value;
    }
    get(key) {
        if (!this._map) {
            return undefined;
        }
        return this._map[key];
    }
    pretty(prettyJSON, space = 2) {
        this._pretty = prettyJSON;
        this._prettySpace = space;
    }
    newResponse(data, status, headers = {}) {
        return new Response(data, {
            status: status || this._status || 200,
            headers: this._finalizeHeaders(headers),
        });
    }
    _finalizeHeaders(incomingHeaders) {
        const finalizedHeaders = [];
        const headersKv = this._headers || {};
        // If Response is already set
        if (this._res) {
            this._res.headers.forEach((v, k) => {
                headersKv[k] = [v];
            });
        }
        for (const key of Object.keys(incomingHeaders)) {
            const value = incomingHeaders[key];
            if (typeof value === 'string') {
                finalizedHeaders.push([key, value]);
            }
            else {
                for (const v of value) {
                    finalizedHeaders.push([key, v]);
                }
            }
            delete headersKv[key];
        }
        for (const key of Object.keys(headersKv)) {
            for (const value of headersKv[key]) {
                const kv = [key, value];
                finalizedHeaders.push(kv);
            }
        }
        return finalizedHeaders;
    }
    body(data, status = this._status, headers = {}) {
        return this.newResponse(data, status, headers);
    }
    text(text, status = this._status, headers = {}) {
        headers['content-type'] = 'text/plain; charset=UTF-8';
        return this.body(text, status, headers);
    }
    json(object, status = this._status, headers = {}) {
        const body = this._pretty
            ? JSON.stringify(object, null, this._prettySpace)
            : JSON.stringify(object);
        headers['content-type'] = 'application/json; charset=UTF-8';
        return this.body(body, status, headers);
    }
    html(html, status = this._status, headers = {}) {
        headers['content-type'] = 'text/html; charset=UTF-8';
        return this.body(html, status, headers);
    }
    redirect(location, status = 302) {
        return this.newResponse(null, status, {
            Location: location,
        });
    }
    cookie(name, value, opt) {
        const cookie = (0, cookie_1.serialize)(name, value, opt);
        this.header('set-cookie', cookie, { append: true });
    }
    notFound() {
        return this.notFoundHandler(this);
    }
}
exports.HonoContext = HonoContext;
