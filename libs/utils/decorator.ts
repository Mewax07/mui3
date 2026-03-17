import {
    ComponentMetadata,
    PlaceholderMetadata,
    PlaceholderType,
    PropertyMetadata,
    PropertyType,
} from "./types";

const metadataStore = new WeakMap<Function, ComponentMetadata>();

export function getComponentMetadata(target: Function): ComponentMetadata {
    if (!metadataStore.has(target)) {
        metadataStore.set(target, {
            props: new Map(),
            placeholders: new Map(),
        });
    }
    return metadataStore.get(target)!;
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function prop(type: PropertyType | "enum", options?: any) {
    return function (target: any, propertyKey: string) {
        const metadata = getComponentMetadata(target.constructor);

        let defaultValue: any;
        let validator: ((value: any) => boolean) | undefined;
        let enumValues: any;

        if (typeof options === "object" && options !== null) {
            defaultValue = options.defaultValue;
            validator = options.validator;
            enumValues = options.enumValues;
        } else {
            defaultValue = options;
        }

        const propMetadata: PropertyMetadata = {
            type: type as PropertyType,
            defaultValue,
            validator,
            enumValues,
        };

        metadata.props.set(propertyKey, propMetadata);

        const privateKey = `_${propertyKey}`;
        const capitalized = capitalize(propertyKey);

        Object.defineProperty(target, propertyKey, {
            get() {
                return this[privateKey] ?? defaultValue;
            },
            set(value: any) {
                const oldValue = this[privateKey];

                if (type === "enum" && enumValues) {
                    const enumArray = Object.values(enumValues);
                    if (!enumArray.includes(value)) {
                        console.warn(
                            `Invalid enum value "${value}" for property "${propertyKey}". Expected one of: ${enumArray.join(", ")}`,
                        );
                        return;
                    }
                }

                if (validator && !validator(value)) {
                    console.warn(
                        `Validation failed for property "${propertyKey}"`,
                    );
                    return;
                }

                this[privateKey] = value;

                if (this.onPropChange) {
                    this.onPropChange(propertyKey, value, oldValue);
                }
            },
            enumerable: true,
            configurable: true,
        });

        const proto = target.constructor.prototype;

        if (type === "boolean") {
            if (!proto[`set${capitalized}`]) {
                proto[`set${capitalized}`] = function (value?: boolean) {
                    this[propertyKey] = value ?? true;
                    return this;
                };
            }
            if (!proto[`get${capitalized}`]) {
                proto[`get${capitalized}`] = function () {
                    return this[propertyKey];
                };
            }
        } else if (type === "array") {
            if (!proto[`add${capitalized}`]) {
                proto[`add${capitalized}`] = function (item: any) {
                    if (!Array.isArray(this[privateKey])) {
                        this[privateKey] = [];
                    }
                    this[privateKey].push(item);
                    if (this.onPropChange) {
                        this.onPropChange(
                            propertyKey,
                            this[privateKey],
                            this[privateKey],
                        );
                    }
                    return this;
                };
            }
            if (!proto[`remove${capitalized}`]) {
                proto[`remove${capitalized}`] = function (item: any) {
                    if (!Array.isArray(this[privateKey])) return this;
                    const index = this[privateKey].indexOf(item);
                    if (index > -1) {
                        this[privateKey].splice(index, 1);
                        if (this.onPropChange) {
                            this.onPropChange(
                                propertyKey,
                                this[privateKey],
                                this[privateKey],
                            );
                        }
                    }
                    return this;
                };
            }
            if (!proto[`clear${capitalized}`]) {
                proto[`clear${capitalized}`] = function () {
                    this[privateKey] = [];
                    if (this.onPropChange) {
                        this.onPropChange(
                            propertyKey,
                            this[privateKey],
                            this[privateKey],
                        );
                    }
                    return this;
                };
            }
        } else if (type === "function") {
            if (!proto[`on${capitalized}`]) {
                proto[`on${capitalized}`] = function (handler: Function) {
                    this[propertyKey] = handler;
                    return this;
                };
            }
            if (!proto[`un${capitalized}`]) {
                proto[`un${capitalized}`] = function () {
                    this[propertyKey] = undefined;
                    return this;
                };
            }
        } else {
            if (!proto[`set${capitalized}`]) {
                proto[`set${capitalized}`] = function (value: any) {
                    this[propertyKey] = value;
                    return this;
                };
            }
            if (!proto[`get${capitalized}`]) {
                proto[`get${capitalized}`] = function () {
                    return this[propertyKey];
                };
            }
        }
    };
}

export function placeholder(
    type: PlaceholderType,
    options?: { defaultContent?: any },
) {
    return function (target: any, propertyKey: string) {
        const metadata = getComponentMetadata(target.constructor);
        const name = propertyKey.replace(/Slot$/, "");

        metadata.placeholders.set(name, {
            name,
            type,
            defaultContent: options?.defaultContent ?? null,
        });

        const proto = target.constructor.prototype;
        const cap = capitalize(name);

        if (!proto[`set${cap}Slot`]) {
            proto[`set${cap}Slot`] = function (content: any) {
                return this.setPlaceholder(name, content, type);
            };
        }

        if (!proto[`clear${cap}Slot`]) {
            proto[`clear${cap}Slot`] = function () {
                return this.clearPlaceholder(name);
            };
        }

        if (!proto[`has${cap}Slot`]) {
            proto[`has${cap}Slot`] = function () {
                return this.hasPlaceholder(name);
            };
        }
    };
}
