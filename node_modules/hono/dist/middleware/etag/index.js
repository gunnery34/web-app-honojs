import { sha1 } from '../../utils/crypto';
export const etag = (options = { weak: false }) => {
    return async (c, next) => {
        const ifNoneMatch = c.req.header('If-None-Match') || c.req.header('if-none-match');
        await next();
        const res = c.res;
        const clone = res.clone();
        const hash = await sha1(res.body || '');
        const etag = options.weak ? `W/"${hash}"` : `"${hash}"`;
        if (ifNoneMatch && ifNoneMatch === etag) {
            await clone.blob(); // Force using body
            c.res = new Response(null, {
                status: 304,
                statusText: 'Not Modified',
            });
            c.res.headers.delete('Content-Length');
        }
        else {
            c.res = new Response(clone.body, clone);
            c.res.headers.append('ETag', etag);
        }
    };
};
