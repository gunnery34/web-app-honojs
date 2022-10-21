export const poweredBy = () => {
    return async (c, next) => {
        await next();
        c.res.headers.append('X-Powered-By', 'Hono');
    };
};
