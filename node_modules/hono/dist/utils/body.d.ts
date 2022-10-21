export declare type BodyData = Record<string, string | number | boolean | File>;
export declare function parseBody<BodyType extends BodyData>(r: Request | Response): Promise<BodyType>;
