/// <reference types="@cloudflare/workers-types" />
import type { Environment, NotFoundHandler, ContextVariableMap, ValidatedData } from './hono';
import type { CookieOptions } from './utils/cookie';
import type { StatusCode } from './utils/http-status';
declare type Headers = Record<string, string | string[]>;
export declare type Data = string | ArrayBuffer | ReadableStream;
export interface Context<RequestParamKeyType extends string = string, E extends Partial<Environment> = any, D extends ValidatedData = ValidatedData> {
    req: Request<RequestParamKeyType, D>;
    env: E['Bindings'];
    event: FetchEvent;
    executionCtx: ExecutionContext;
    finalized: boolean;
    error: Error | undefined;
    get res(): Response;
    set res(_res: Response);
    header: (name: string, value: string, options?: {
        append?: boolean;
    }) => void;
    status: (status: StatusCode) => void;
    set: {
        <Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void;
        <Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void;
        (key: string, value: any): void;
    };
    get: {
        <Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key];
        <Key extends keyof E['Variables']>(key: Key): E['Variables'][Key];
        <T = any>(key: string): T;
    };
    pretty: (prettyJSON: boolean, space?: number) => void;
    newResponse: (data: Data | null, status: StatusCode, headers: Headers) => Response;
    body: (data: Data | null, status?: StatusCode, headers?: Headers) => Response;
    text: (text: string, status?: StatusCode, headers?: Headers) => Response;
    json: <T>(object: T, status?: StatusCode, headers?: Headers) => Response;
    html: (html: string, status?: StatusCode, headers?: Headers) => Response;
    redirect: (location: string, status?: StatusCode) => Response;
    cookie: (name: string, value: string, options?: CookieOptions) => void;
    notFound: () => Response | Promise<Response>;
}
export declare class HonoContext<RequestParamKeyType extends string = string, E extends Partial<Environment> = Environment, D extends ValidatedData = ValidatedData> implements Context<RequestParamKeyType, E, D> {
    req: Request<RequestParamKeyType, D>;
    env: E['Bindings'];
    finalized: boolean;
    error: Error | undefined;
    _status: StatusCode;
    private _executionCtx;
    private _pretty;
    private _prettySpace;
    private _map;
    private _headers;
    private _res;
    private notFoundHandler;
    constructor(req: Request<RequestParamKeyType>, env?: E['Bindings'] | undefined, executionCtx?: FetchEvent | ExecutionContext | undefined, notFoundHandler?: NotFoundHandler<E>);
    get event(): FetchEvent;
    get executionCtx(): ExecutionContext;
    get res(): Response;
    set res(_res: Response);
    header(name: string, value: string, options?: {
        append?: boolean;
    }): void;
    status(status: StatusCode): void;
    set<Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void;
    set<Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void;
    set(key: string, value: any): void;
    get<Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key];
    get<Key extends keyof E['Variables']>(key: Key): E['Variables'][Key];
    get<T = any>(key: string): T;
    pretty(prettyJSON: boolean, space?: number): void;
    newResponse(data: Data | null, status: StatusCode, headers?: Headers): Response;
    private _finalizeHeaders;
    body(data: Data | null, status?: StatusCode, headers?: Headers): Response;
    text(text: string, status?: StatusCode, headers?: Headers): Response;
    json<T>(object: T, status?: StatusCode, headers?: Headers): Response;
    html(html: string, status?: StatusCode, headers?: Headers): Response;
    redirect(location: string, status?: StatusCode): Response;
    cookie(name: string, value: string, opt?: CookieOptions): void;
    notFound(): Response | Promise<Response>;
}
export {};
