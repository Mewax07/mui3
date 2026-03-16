export type PropertyType =
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "function"
    | "enum";

export interface PropertyMetadata {
    type: PropertyType;
    defaultValue?: any;
    required?: boolean;
    validator?: (value: any) => boolean;
    enumValues?: any;
}

export type PlaceholderType = "text" | "icon" | "html" | "component";

export interface PlaceholderMetadata {
    name: string;
    type: PlaceholderType;
    multiple?: boolean;
    defaultContent?: any;
}

export interface ComponentMetadata {
    props: Map<string, PropertyMetadata>;
    placeholders: Map<string, PlaceholderMetadata>;
}

type Capitalize<S extends string> = S extends `${infer F}${infer R}`
    ? `${Uppercase<F>}${R}`
    : S;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I,
) => void
    ? I
    : never;

type PrimitiveMethods<K extends string, T, Self> = {
    [P in K as `get${Capitalize<P>}`]: () => T;
} & {
    [P in K as `set${Capitalize<P>}`]: (value: T) => Self;
};

type BooleanMethods<K extends string, Self> = {
    [P in K as `get${Capitalize<P>}`]: () => boolean;
} & {
    [P in K as `set${Capitalize<P>}`]: {
        (): Self;
        (value: boolean): Self;
    };
};

type ArrayMethods<K extends string, T extends any[], Self> = {
    [P in K as `add${Capitalize<P>}`]: (value: T[number]) => Self;
} & {
    [P in K as `remove${Capitalize<P>}`]: (value: T[number]) => Self;
} & {
    [P in K as `clear${Capitalize<P>}`]: () => Self;
};

type ObjectMethods<K extends string, T extends Record<string, any>, Self> = {
    [P in K as `set${Capitalize<P>}`]: ((
        key: keyof T,
        value: T[keyof T],
    ) => Self) &
        ((obj: Partial<T>) => Self);
} & {
    [P in K as `remove${Capitalize<P>}`]: (key: keyof T) => Self;
} & {
    [P in K as `get${Capitalize<P>}`]: {
        (): T;
        (key: keyof T): T[keyof T];
    };
};

type FunctionMethods<K extends string, T extends Function, Self> = {
    [P in K as `on${Capitalize<P>}`]: (handler: T) => Self;
} & {
    [P in K as `un${Capitalize<P>}`]: () => Self;
};

type EnumMethods<K extends string, T, Self> = {
    [P in K as `set${Capitalize<P>}`]: (value: T) => Self;
};

type TextPlaceholderMethods<K extends string, Self> = {
    [P in K as `add${Capitalize<P>}`]: (content: string) => Self;
} & {
    [P in K as `set${Capitalize<P>}`]: (content: string | string[]) => Self;
} & {
    [P in K as `clear${Capitalize<P>}`]: () => Self;
};

type IconPlaceholderMethods<K extends string, Self> = {
    [P in K as `add${Capitalize<P>}`]: (icon: string) => Self;
} & {
    [P in K as `set${Capitalize<P>}`]: (icon: string | string[]) => Self;
} & {
    [P in K as `clear${Capitalize<P>}`]: () => Self;
};

type HtmlPlaceholderMethods<K extends string, Self> = {
    [P in K as `add${Capitalize<P>}`]: (content: any) => Self;
} & {
    [P in K as `set${Capitalize<P>}`]: (content: any | any[]) => Self;
} & {
    [P in K as `clear${Capitalize<P>}`]: () => Self;
};

type ComponentPlaceholderMethods<K extends string, C, Self> = {
    [P in K as `add${Capitalize<P>}`]: (component: C) => Self;
} & {
    [P in K as `set${Capitalize<P>}`]: (component: C | C[]) => Self;
} & {
    [P in K as `clear${Capitalize<P>}`]: () => Self;
};

export type WithPropMethods<T, Self> = UnionToIntersection<
    {
        [K in keyof T]: T[K] extends string
            ? PrimitiveMethods<K & string, string, Self>
            : T[K] extends number
              ? PrimitiveMethods<K & string, number, Self>
              : T[K] extends boolean
                ? BooleanMethods<K & string, Self>
                : T[K] extends any[]
                  ? ArrayMethods<K & string, T[K], Self>
                  : T[K] extends Function
                    ? FunctionMethods<K & string, T[K], Self>
                    : T[K] extends Record<string, any>
                      ? ObjectMethods<K & string, T[K], Self>
                      : unknown;
    }[keyof T]
>;

export type WithEnumMethod<K extends string, E, Self> = EnumMethods<K, E, Self>;

export type WithPlaceholderMethods<T, Self> = UnionToIntersection<
    {
        [K in keyof T]: T[K] extends { type: "text" }
            ? TextPlaceholderMethods<K & string, Self>
            : T[K] extends { type: "icon" }
              ? IconPlaceholderMethods<K & string, Self>
              : T[K] extends { type: "html" }
                ? HtmlPlaceholderMethods<K & string, Self>
                : T[K] extends { type: "component"; componentType: infer C }
                  ? ComponentPlaceholderMethods<K & string, C, Self>
                  : unknown;
    }[keyof T]
>;

export function validateType(
    value: any,
    type: PropertyType,
    enumValues?: readonly any[],
): boolean {
    switch (type) {
        case "string":
            return typeof value === "string";
        case "number":
            return typeof value === "number";
        case "boolean":
            return typeof value === "boolean";
        case "object":
            return typeof value === "object" && value !== null;
        case "array":
            return Array.isArray(value);
        case "function":
            return typeof value === "function";
        case "enum":
            if (!enumValues) return false;
            return enumValues.includes(value);
        default:
            return true;
    }
}

export function validatePlaceholderType(
    value: any,
    type: PlaceholderType,
): boolean {
    switch (type) {
        case "text":
            return typeof value === "string";
        case "icon":
            return typeof value === "string";
        case "html":
            return value && typeof value === "object" && "mount" in value;
        case "component":
            return (
                value &&
                typeof value === "object" &&
                "mount" in value &&
                "template" in value
            );
        default:
            return true;
    }
}
