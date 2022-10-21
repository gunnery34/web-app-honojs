"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeObjects = exports.isObject = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val);
exports.isObject = isObject;
const mergeObjects = (target, source) => {
    const merged = Object.assign({}, target);
    if ((0, exports.isObject)(target) && (0, exports.isObject)(source)) {
        for (const key of Object.keys(source)) {
            if ((0, exports.isObject)(source[key])) {
                if (target[key] === undefined)
                    Object.assign(merged, { [key]: source[key] });
                else
                    merged[key] = (0, exports.mergeObjects)(target[key], source[key]);
            }
            else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
                const srcArr = source[key];
                const tgtArr = target[key];
                const outArr = [];
                for (let i = 0; i < srcArr.length; i += 1) {
                    // If corresponding index for both arrays is an object, then merge them
                    // Otherwise just copy src arr index into out arr index
                    if ((0, exports.isObject)(srcArr[i]) && (0, exports.isObject)(tgtArr[i])) {
                        outArr[i] = (0, exports.mergeObjects)(tgtArr[i], srcArr[i]);
                    }
                    else {
                        outArr[i] = srcArr[i];
                    }
                }
                Object.assign(merged, { [key]: outArr });
            }
            else {
                Object.assign(merged, { [key]: source[key] });
            }
        }
    }
    return merged;
};
exports.mergeObjects = mergeObjects;
