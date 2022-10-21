// Some validation rules is are based on Validator.js
// Validator.js
// License (MIT)
// Copyright (c) 2018 Chris O'Hara <cohara87@gmail.com>
// https://github.com/validatorjs/validator.js
export const rule = {
    // string
    isEmpty(value, options = { ignore_whitespace: false }) {
        return (options.ignore_whitespace ? value.trim().length : value.length) === 0;
    },
    isLength: (value, options, arg2) => {
        let min;
        let max;
        if (typeof options === 'object') {
            min = options.min || 0;
            max = options.max;
        }
        else {
            // backwards compatibility: isLength(str, min [, max])
            min = options || 0;
            max = arg2;
        }
        const presentationSequences = value.match(/(\uFE0F|\uFE0E)/g) || [];
        const surrogatePairs = value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
        const len = value.length - presentationSequences.length - surrogatePairs.length;
        return len >= min && (typeof max === 'undefined' || len <= max);
    },
    isAlpha: (value) => {
        return /^[A-Z]+$/i.test(value);
    },
    isNumeric: (value) => {
        return /^[0-9]+$/.test(value);
    },
    contains: (value, elem, options = {
        ignoreCase: false,
        minOccurrences: 1,
    }) => {
        options.ignoreCase || (options.ignoreCase = false);
        options.minOccurrences || (options.minOccurrences = 1);
        if (options.ignoreCase) {
            return value.toLowerCase().split(elem.toLowerCase()).length > options.minOccurrences;
        }
        return value.split(elem).length > options.minOccurrences;
    },
    isIn: (value, options) => {
        if (typeof options === 'object') {
            for (const elem of options) {
                if (elem === value)
                    return true;
            }
        }
        return false;
    },
    match: (value, regExp) => {
        return regExp.test(value);
    },
    // number
    isGte: (value, min) => min <= value,
    isLte: (value, max) => value <= max,
    // boolean
    isTrue: (value) => value === true,
    isFalse: (value) => value === false,
};
