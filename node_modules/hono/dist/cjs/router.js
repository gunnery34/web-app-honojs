"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedPathError = exports.METHODS = exports.METHOD_NAME_ALL_LOWERCASE = exports.METHOD_NAME_ALL = void 0;
exports.METHOD_NAME_ALL = 'ALL';
exports.METHOD_NAME_ALL_LOWERCASE = 'all';
exports.METHODS = ['get', 'post', 'put', 'delete', 'head', 'options', 'patch'];
class UnsupportedPathError extends Error {
}
exports.UnsupportedPathError = UnsupportedPathError;
