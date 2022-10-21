export declare type JSONPrimitive = string | boolean | number | null | undefined;
export declare type JSONArray = (JSONPrimitive | JSONObject | JSONArray)[];
export declare type JSONObject = {
    [key: string]: JSONPrimitive | JSONArray | JSONObject;
};
export declare type JSONValue = JSONObject | JSONArray | JSONPrimitive;
export declare const JSONPathCopy: (src: JSONObject, dst: JSONObject, path: string) => JSONPrimitive | JSONObject | JSONArray;
