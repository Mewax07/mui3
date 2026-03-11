import { Component } from "../utils/component";
import { prop } from "../utils/decorator";
import { Html } from "../utils/html";
import { Style } from "../utils/style";
import { darkTheme, ThemeManager } from "../utils/theme";
import { WithEnumMethod, WithPropMethods } from "../utils/types";

export enum ButtonType {
    ELEVATED = "elevated",
    FILLED = "filled",
    TONAL = "tonal",
    OUTLINED = "outlined",
    TEXT = "text",
}

interface ButtonProps {
    label: string;
}

export interface Button
    extends
        WithPropMethods<ButtonProps, Button>,
        WithEnumMethod<"type", ButtonType, Button> {}

new Style(".btn")
    .withTheme(darkTheme)
    .themeFontSize("lg")
    .themeSpace("sm", "gap")
    .themeSpace("md", "pi")
    .themeBgColor("primary")
    .themeColor("on_primary")
    .themeRadius("md")
    .cursor("pointer")
    .position("relative")
    .w("max-content")
    .h(40)
    .border(1, "solid", "transparent")
    .display("flex")
    .alignItems("center")
    .justifyContent("center")
    .bgRepeat("no-repeat")
    .bgPosition("center")
    .apply();

new Style(".btn--elevated")
    .withTheme(darkTheme)
    .themeBgColor("surface_container_lowest")
    .themeColor("primary")
    .hover((hover) => {
        hover.bgColor("color-mix(in srgb, currentColor 8%, transparent)");
    })
    .apply();

new Style(".btn--filled")
    .withTheme(darkTheme)
    .themeBgColor("primary")
    .themeColor("on_primary")
    .hover((hover) => {
        hover.bgColor("color-mix(in srgb, $primary$ 92%, transparent)");
    })
    .apply();

new Style(".btn--tonal")
    .withTheme(darkTheme)
    .themeBgColor("secondary_container")
    .themeColor("on_secondary_container")
    .hover((hover) => {
        hover.bgColor(
            "color-mix(in srgb, currentColor 8%, $secondary_container$)",
        );
    })
    .apply();

new Style(".btn--text")
    .withTheme(darkTheme)
    .bg("transparent")
    .themeColor("primary")
    .hover((hover) => {
        hover.bgColor("color-mix(in srgb, currentColor 8%, transparent)");
    })
    .apply();

new Style(".btn--outlined")
    .withTheme(darkTheme)
    .bg("transparent")
    .themeColor("on_surface_variant")
    .themeBorderColor("outline_variant")
    .hover((hover) => {
        hover.bgColor("color-mix(in srgb, currentColor 8%, transparent)");
    })
    .apply();

export class Button extends Component {
    private static theme = new ThemeManager();

    @prop("enum", {
        enumValues: ButtonType,
    })
    private type: ButtonType = ButtonType.FILLED;

    @prop("string")
    private label: string = "text";

    constructor() {
        super();
    }

    protected template(): Html {
        const container = new Html("button")
            .class("btn", `btn--${this.type}`)
            .text(this.label);

        return container;
    }
}
