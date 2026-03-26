import { Component } from "../../utils";
import { Button } from "./button";
import { ButtonIcon } from "./icon.button";

/// Shared style (Yes I wrote comment like rust and ??!)

export const BasicSize = {
    EXTRA_SMALL: "xs",
    SMALL: "sm",
    MEDIUM: "md",
    LARGE: "lg",
    EXTRA_LARGE: "xl",
} as const;

export type BasicSize = (typeof BasicSize)[keyof typeof BasicSize];

/// Important Config Interface/Types

export interface IButton extends Component {}

export interface BaseConfig {
    kind: string;
    disabled?: boolean;
}

export interface ButtonConfig extends BaseConfig {
    kind: "button";
    label: string;
}

export interface ButtonIconConfig extends BaseConfig {
    kind: "icon";
    icon: string;
    type?: "outlined" | "rounded";
}

export interface ButtonSelectionConfig extends BaseConfig {
    kind: "selection";
}

export type AnyButtonConfig =
    | ButtonConfig
    | ButtonIconConfig
    | ButtonSelectionConfig;

type ButtonFactory = {
    button: new (label: string) => IButton;
    icon: new (icon: string) => IButton;
    selection: new (label: string) => IButton;
};

export const buttonFactory: ButtonFactory = {
    button: Button,
    icon: ButtonIcon,
    selection: Button,
};
