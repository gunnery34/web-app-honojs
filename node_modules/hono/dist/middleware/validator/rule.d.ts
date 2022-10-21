export declare const rule: {
    isEmpty(value: string, options?: {
        ignore_whitespace: boolean;
    }): boolean;
    isLength: (value: string, options: Partial<{
        min: number;
        max: number;
    }> | number, arg2?: number) => boolean;
    isAlpha: (value: string) => boolean;
    isNumeric: (value: string) => boolean;
    contains: (value: string, elem: string, options?: Partial<{
        ignoreCase: boolean;
        minOccurrences: number;
    }>) => boolean;
    isIn: (value: string, options: string[]) => boolean;
    match: (value: string, regExp: RegExp) => boolean;
    isGte: (value: number, min: number) => boolean;
    isLte: (value: number, max: number) => boolean;
    isTrue: (value: boolean) => boolean;
    isFalse: (value: boolean) => boolean;
};
