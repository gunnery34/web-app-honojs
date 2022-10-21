import type { BodyData } from './utils/body';
import type { Cookie } from './utils/cookie';
declare type ValidatedData = Record<string, any>;
declare global {
    interface Request<ParamKeyType extends string = string, Data extends ValidatedData = ValidatedData> {
        paramData?: Record<ParamKeyType, string>;
        param: {
            (key: ParamKeyType): string;
            (): Record<ParamKeyType, string>;
        };
        queryData?: Record<string, string>;
        query: {
            (key: string): string;
            (): Record<string, string>;
        };
        queries: {
            (key: string): string[];
            (): Record<string, string[]>;
        };
        headerData?: Record<string, string>;
        header: {
            (name: string): string;
            (): Record<string, string>;
        };
        cookie: {
            (name: string): string;
            (): Cookie;
        };
        bodyData?: BodyData;
        parseBody<BodyType extends BodyData>(): Promise<BodyType>;
        jsonData?: any;
        json<JSONData = any>(): Promise<JSONData>;
        data: Data;
        valid: {
            (key: string | string[], value: any): Data;
            (): Data;
        };
    }
}
export declare function extendRequestPrototype(): void;
export {};
