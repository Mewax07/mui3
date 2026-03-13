import { Html } from "./html";
import type {
	ComponentMetadata,
	PlaceholderMetadata,
	PropertyMetadata,
	PropertyType,
} from "./types";

const METADATA_KEY = Symbol("component:metadata");

export function getComponentMetadata(target: any): ComponentMetadata {
	if (!target[METADATA_KEY]) {
		target[METADATA_KEY] = {
			props: new Map<string, PropertyMetadata>(),
			placeholders: new Map<string, PlaceholderMetadata>(),
		};
	}
	return target[METADATA_KEY];
}

export function prop(
	type: PropertyType,
	options: Partial<PropertyMetadata> = {},
) {
	return function (target: any, propertyKey: string) {
		const metadata = getComponentMetadata(target.constructor);

		const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
		const defaultValue = descriptor?.value;

		let enumValues = options.enumValues;
		if (type === "enum" && enumValues) {
			if (typeof enumValues === "object" && !Array.isArray(enumValues)) {
				enumValues = Object.values(enumValues);
			}
		}

		metadata.props.set(propertyKey, {
			type,
			defaultValue,
			required: options.required ?? false,
			validator: options.validator,
			enumValues: enumValues as readonly any[],
		});

		let value = defaultValue;

		Object.defineProperty(target, propertyKey, {
			get() {
				return value;
			},
			set(newValue: any) {
				const propMeta = metadata.props.get(propertyKey)!;

				if (
					!validateType(newValue, propMeta.type, propMeta.enumValues)
				) {
					console.warn(
						`Invalid value "${newValue}" for prop "${propertyKey}". ` +
							`Expected ${propMeta.type}` +
							(propMeta.enumValues
								? `: ${propMeta.enumValues.join(", ")}`
								: ""),
					);
					return;
				}

				if (propMeta.validator && !propMeta.validator(newValue)) {
					console.warn(`Validation failed for prop "${propertyKey}"`);
					return;
				}

				const oldValue = value;
				value = newValue;

				if (this._mounted && this.onPropChange) {
					this.onPropChange(propertyKey, newValue, oldValue);
				}
			},
			enumerable: true,
			configurable: true,
		});

		generateDynamicMethods(target, propertyKey, type, defaultValue);
	};
}

function validateType(
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

function generateDynamicMethods(
	target: any,
	propName: string,
	type: PropertyType,
	defaultValue: any,
): void {
	const capitalizedName =
		propName.charAt(0).toUpperCase() + propName.slice(1);

	switch (type) {
		case "string":
		case "number":
			generateGetterSetter(target, propName, capitalizedName);
			break;

		case "boolean":
			generateBooleanMethods(
				target,
				propName,
				capitalizedName,
				defaultValue,
			);
			break;

		case "array":
			generateArrayMethods(target, propName, capitalizedName);
			break;

		case "enum":
			generateEnumMethods(target, propName, capitalizedName);
			break;

		case "object":
			generateObjectMethods(target, propName, capitalizedName);
			break;

		case "function":
			generateEventMethods(target, propName, capitalizedName);
			break;
	}
}

function generateGetterSetter(
	target: any,
	propName: string,
	capitalizedName: string,
): void {
	const getterName = `get${capitalizedName}`;
	if (!target[getterName]) {
		target[getterName] = function () {
			return this[propName];
		};
	}

	const setterName = `set${capitalizedName}`;
	if (!target[setterName]) {
		target[setterName] = function (value: any) {
			this[propName] = value;
			return this;
		};
	}
}

function generateBooleanMethods(
	target: any,
	propName: string,
	capitalizedName: string,
	defaultValue: boolean,
): void {
	const getterName = `get${capitalizedName}`;
	if (!target[getterName]) {
		target[getterName] = function () {
			return this[propName];
		};
	}

	const setterName = `set${capitalizedName}`;
	if (!target[setterName]) {
		target[setterName] = function (value?: boolean) {
			if (value === undefined) {
				this[propName] = !defaultValue;
			} else {
				this[propName] = value;
			}
			return this;
		};
	}
}

function generateArrayMethods(
	target: any,
	propName: string,
	capitalizedName: string,
): void {
	const addName = `add${capitalizedName}`;
	if (!target[addName]) {
		target[addName] = function (value: any) {
			if (!Array.isArray(this[propName])) {
				this[propName] = [];
			}
			this[propName] = [...this[propName], value];
			return this;
		};
	}

	const removeName = `remove${capitalizedName}`;
	if (!target[removeName]) {
		target[removeName] = function (value: any) {
			if (!Array.isArray(this[propName])) return this;
			const index = this[propName].indexOf(value);
			if (index > -1) {
				this[propName] = [
					...this[propName].slice(0, index),
					...this[propName].slice(index + 1),
				];
			}
			return this;
		};
	}

	const clearName = `clear${capitalizedName}`;
	if (!target[clearName]) {
		target[clearName] = function () {
			this[propName] = [];
			return this;
		};
	}
}

function generateEnumMethods(
	target: any,
	propName: string,
	capitalizedName: string,
): void {
	const setterName = `set${capitalizedName}`;
	if (!target[setterName]) {
		target[setterName] = function (value: any) {
			this[propName] = value;
			return this;
		};
	}
}

function generateObjectMethods(
	target: any,
	propName: string,
	capitalizedName: string,
): void {
	const setterName = `set${capitalizedName}`;
	if (!target[setterName]) {
		target[setterName] = function (keyOrObject: any, value?: any) {
			if (typeof keyOrObject === "object" && value === undefined) {
				this[propName] = { ...this[propName], ...keyOrObject };
			} else {
				this[propName] = { ...this[propName], [keyOrObject]: value };
			}
			return this;
		};
	}

	const removeName = `remove${capitalizedName}`;
	if (!target[removeName]) {
		target[removeName] = function (key: string) {
			if (this[propName] && typeof this[propName] === "object") {
				const newObj = { ...this[propName] };
				delete newObj[key];
				this[propName] = newObj;
			}
			return this;
		};
	}

	const getterName = `get${capitalizedName}`;
	if (!target[getterName]) {
		target[getterName] = function (key?: string) {
			if (key === undefined) return this[propName];
			return this[propName]?.[key];
		};
	}
}

function generateEventMethods(
	target: any,
	propName: string,
	capitalizedName: string,
): void {
	const onName = `on${capitalizedName}`;
	if (!target[onName]) {
		target[onName] = function (handler: Function) {
			this[propName] = handler;
			return this;
		};
	}

	const unName = `un${capitalizedName}`;
	if (!target[unName]) {
		target[unName] = function () {
			this[propName] = undefined;
			return this;
		};
	}
}

export function placeholder(
	type: PlaceholderMetadata["type"],
	defaultContent?: string | Html,
) {
	return function (target: any, propertyKey: string) {
		const metadata = getComponentMetadata(target.constructor);

		metadata.placeholders.set(propertyKey, {
			name: propertyKey,
			type,
			defaultContent,
		});

		let placeholderValue: Html | null = null;

		Object.defineProperty(target, propertyKey, {
			get() {
				return placeholderValue;
			},
			set(newValue: Html | string) {
				if (typeof newValue === "string") {
					placeholderValue = new Html("div").text(newValue);
				} else {
					placeholderValue = newValue;
				}

				if (this._mounted && this.onPlaceholderChange) {
					this.onPlaceholderChange(propertyKey, placeholderValue);
				}
			},
			enumerable: true,
			configurable: true,
		});
	};
}
