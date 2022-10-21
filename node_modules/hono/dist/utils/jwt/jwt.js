import { utf8ToUint8Array, encodeBase64URL, arrayBufferToBase64URL, decodeBase64URL, } from '../../utils/encode';
import { AlgorithmTypes } from './types';
import { JwtTokenInvalid, JwtTokenNotBefore, JwtTokenExpired, JwtTokenSignatureMismatched, JwtAlgorithmNotImplemented, } from './types';
var CryptoKeyFormat;
(function (CryptoKeyFormat) {
    CryptoKeyFormat["RAW"] = "raw";
    CryptoKeyFormat["PKCS8"] = "pkcs8";
    CryptoKeyFormat["SPKI"] = "spki";
    CryptoKeyFormat["JWK"] = "jwk";
})(CryptoKeyFormat || (CryptoKeyFormat = {}));
var CryptoKeyUsage;
(function (CryptoKeyUsage) {
    CryptoKeyUsage["Ecrypt"] = "encrypt";
    CryptoKeyUsage["Decrypt"] = "decrypt";
    CryptoKeyUsage["Sign"] = "sign";
    CryptoKeyUsage["Verify"] = "verify";
    CryptoKeyUsage["Deriverkey"] = "deriveKey";
    CryptoKeyUsage["DeriveBits"] = "deriveBits";
    CryptoKeyUsage["WrapKey"] = "wrapKey";
    CryptoKeyUsage["UnwrapKey"] = "unwrapKey";
})(CryptoKeyUsage || (CryptoKeyUsage = {}));
const param = (name) => {
    switch (name.toUpperCase()) {
        case 'HS256':
            return {
                name: 'HMAC',
                hash: {
                    name: 'SHA-256',
                },
            };
        case 'HS384':
            return {
                name: 'HMAC',
                hash: {
                    name: 'SHA-384',
                },
            };
        case 'HS512':
            return {
                name: 'HMAC',
                hash: {
                    name: 'SHA-512',
                },
            };
        default:
            throw new JwtAlgorithmNotImplemented(name);
    }
};
const signing = async (data, secret, alg = AlgorithmTypes.HS256) => {
    if (!crypto.subtle || !crypto.subtle.importKey) {
        throw new Error('`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.');
    }
    const cryptoKey = await crypto.subtle.importKey(CryptoKeyFormat.RAW, utf8ToUint8Array(secret), param(alg), false, [CryptoKeyUsage.Sign]);
    return await crypto.subtle.sign(param(alg), cryptoKey, utf8ToUint8Array(data));
};
export const sign = async (payload, secret, alg = AlgorithmTypes.HS256) => {
    const encodedPayload = await encodeBase64URL(JSON.stringify(payload));
    const encodedHeader = await encodeBase64URL(JSON.stringify({ alg, typ: 'JWT' }));
    const partialToken = `${encodedHeader}.${encodedPayload}`;
    const signature = await arrayBufferToBase64URL(await signing(partialToken, secret, alg));
    return `${partialToken}.${signature}`;
};
export const verify = async (token, secret, alg = AlgorithmTypes.HS256) => {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        throw new JwtTokenInvalid(token);
    }
    const { payload } = decode(token);
    if (payload.nbf && payload.nbf > Math.floor(Date.now() / 1000)) {
        throw new JwtTokenNotBefore(token);
    }
    if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new JwtTokenExpired(token);
    }
    const signature = await arrayBufferToBase64URL(await signing(tokenParts.slice(0, 2).join('.'), secret, alg));
    if (signature !== tokenParts[2]) {
        throw new JwtTokenSignatureMismatched(token);
    }
    return true;
};
// eslint-disable-next-line
export const decode = (token) => {
    try {
        const [h, p] = token.split('.');
        const header = JSON.parse(decodeBase64URL(h));
        const payload = JSON.parse(decodeBase64URL(p));
        return {
            header,
            payload,
        };
    }
    catch (e) {
        throw new JwtTokenInvalid(token);
    }
};
