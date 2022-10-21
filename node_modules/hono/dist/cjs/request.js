"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendRequestPrototype = void 0;
const body_1 = require("./utils/body");
const cookie_1 = require("./utils/cookie");
const url_1 = require("./utils/url");
function extendRequestPrototype() {
    if (!!Request.prototype.param) {
        // already extended
        return;
    }
    Request.prototype.param = function (key) {
        if (this.paramData) {
            if (key) {
                return this.paramData[key];
            }
            else {
                return this.paramData;
            }
        }
        return null;
    };
    Request.prototype.header = function (name) {
        if (!this.headerData) {
            this.headerData = {};
            for (const [key, value] of this.headers) {
                this.headerData[key] = value;
            }
        }
        if (name) {
            return this.headerData[name.toLowerCase()];
        }
        else {
            return this.headerData;
        }
    };
    Request.prototype.query = function (key) {
        const queryString = (0, url_1.getQueryStringFromURL)(this.url);
        const searchParams = new URLSearchParams(queryString);
        if (!this.queryData) {
            this.queryData = {};
            for (const key of searchParams.keys()) {
                this.queryData[key] = searchParams.get(key) || '';
            }
        }
        if (key) {
            return this.queryData[key];
        }
        else {
            return this.queryData;
        }
    };
    Request.prototype.queries = function (key) {
        const queryString = (0, url_1.getQueryStringFromURL)(this.url);
        const searchParams = new URLSearchParams(queryString);
        if (key) {
            return searchParams.getAll(key);
        }
        else {
            const result = {};
            for (const key of searchParams.keys()) {
                result[key] = searchParams.getAll(key);
            }
            return result;
        }
    };
    Request.prototype.cookie = function (key) {
        const cookie = this.headers.get('Cookie') || '';
        const obj = (0, cookie_1.parse)(cookie);
        if (key) {
            const value = obj[key];
            return value;
        }
        else {
            return obj;
        }
    };
    Request.prototype.parseBody = async function () {
        // Cache the parsed body
        let body;
        if (!this.bodyData) {
            body = await (0, body_1.parseBody)(this);
            this.bodyData = body;
        }
        else {
            body = this.bodyData;
        }
        return body;
    };
    Request.prototype.json = async function () {
        // Cache the JSON body
        let jsonData;
        if (!this.jsonData) {
            jsonData = JSON.parse(await this.text());
            this.jsonData = jsonData;
        }
        else {
            jsonData = this.jsonData;
        }
        return jsonData;
    };
    Request.prototype.valid = function (keys, value) {
        var _a;
        if (!this.data) {
            this.data = {};
        }
        if (keys !== undefined) {
            if (typeof keys === 'string') {
                keys = [keys];
            }
            let data = this.data;
            for (let i = 0; i < keys.length - 1; i++) {
                data = data[_a = keys[i]] || (data[_a] = {});
            }
            data[keys[keys.length - 1]] = value;
        }
        return this.data;
    };
}
exports.extendRequestPrototype = extendRequestPrototype;
