import { HonoContext } from './context';
// Based on the code in the MIT licensed `koa-compose` package.
export const compose = (middleware, onNotFound, onError) => {
    const middlewareLength = middleware.length;
    return (context, next) => {
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index) {
                throw new Error('next() called multiple times');
            }
            let handler = middleware[i];
            index = i;
            if (i === middlewareLength && next)
                handler = next;
            let res;
            let isError = false;
            if (!handler) {
                if (context instanceof HonoContext && context.finalized === false && onNotFound) {
                    res = onNotFound(context);
                }
            }
            else {
                try {
                    res = handler(context, () => {
                        const dispatchRes = dispatch(i + 1);
                        return dispatchRes instanceof Promise ? dispatchRes : Promise.resolve(dispatchRes);
                    });
                }
                catch (err) {
                    if (err instanceof Error && context instanceof HonoContext && onError) {
                        context.error = err;
                        res = onError(err, context);
                        isError = true;
                    }
                    else {
                        throw err;
                    }
                }
            }
            if (!(res instanceof Promise)) {
                if (res && (context.finalized === false || isError)) {
                    context.res = res;
                }
                return context;
            }
            else {
                return res
                    .then((res) => {
                    if (res && context.finalized === false) {
                        context.res = res;
                    }
                    return context;
                })
                    .catch((err) => {
                    if (err instanceof Error && context instanceof HonoContext && onError) {
                        context.error = err;
                        context.res = onError(err, context);
                        return context;
                    }
                    throw err;
                });
            }
        }
    };
};
