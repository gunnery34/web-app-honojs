"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
async function parseBody(r) {
    let body = {};
    const contentType = r.headers.get('Content-Type');
    if (contentType &&
        (contentType.startsWith('multipart/form-data') ||
            contentType === 'application/x-www-form-urlencoded')) {
        const form = {};
        body = [...(await r.formData())].reduce((acc, cur) => {
            acc[cur[0]] = cur[1];
            return acc;
        }, form);
    }
    return body;
}
exports.parseBody = parseBody;
