import type { Context } from '../../context';
import type { Environment, Next, ValidatedData } from '../../hono';
import { Validator, VObjectBase } from './validator';
import type { VString, VNumber, VBoolean, VObject, VNumberArray, VStringArray, VBooleanArray, ValidateResult, VArray } from './validator';
export declare type Schema = {
    [key: string]: VString | VNumber | VBoolean | VStringArray | VNumberArray | VBooleanArray | Schema | VObject<Schema> | VArray<Schema>;
};
declare type SchemaToProp<T> = {
    [K in keyof T]: T[K] extends VNumberArray ? number[] : T[K] extends VBooleanArray ? boolean[] : T[K] extends VStringArray ? string[] : T[K] extends VNumber ? number : T[K] extends VBoolean ? boolean : T[K] extends VString ? string : T[K] extends VObjectBase<Schema> ? T[K]['container'] extends VNumber ? number : T[K]['container'] extends VString ? string : T[K]['container'] extends VBoolean ? boolean : T[K] extends VArray<Schema> ? SchemaToProp<ReadonlyArray<T[K]['container']>> : T[K] extends VObject<Schema> ? SchemaToProp<T[K]['container']> : T[K] extends Schema ? SchemaToProp<T[K]> : never : SchemaToProp<T[K]>;
};
declare type ResultSet = {
    hasError: boolean;
    messages: string[];
    results: ValidateResult[];
};
declare type Done<Env extends Partial<Environment>> = (resultSet: ResultSet, context: Context<string, Env>) => Response | void;
declare type ValidationFunction<T, Env extends Partial<Environment>> = (v: Validator, c: Context<string, Env>) => T;
declare type MiddlewareHandler<Data extends ValidatedData = ValidatedData, Env extends Partial<Environment> = Environment> = (c: Context<string, Env, Data>, next: Next) => Promise<void> | Promise<Response | undefined>;
export declare const validatorMiddleware: <T extends Schema, Env extends Partial<Environment>>(validationFunction: ValidationFunction<T, Env>, options?: {
    done?: Done<Env> | undefined;
} | undefined) => MiddlewareHandler<SchemaToProp<T>, Env>;
export {};
