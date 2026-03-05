import { Component } from "../utils/component";
import { prop } from "../utils/decorator";
import { Html } from "../utils/html";
import { Style } from "../utils/style";
import { darkTheme, ThemeManager } from "../utils/theme";
import { WithEnumMethod, WithPropMethods } from "../utils/types";

enum ButtonType {
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

export class Button extends Component {
    private static theme = new ThemeManager();

    @prop("enum", {
        enumValues: ButtonType,
    })
    private type: ButtonType = ButtonType.FILLED;

    @prop("string")
    private label: string = "text";

    constructor(theme?: ThemeManager) {
        super();
        if (theme) {
            Button.theme = theme;
        }
        this.initStyles();
    }

    private initStyles() {
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
    }

    protected template(): Html {
        const container = new Html("button").class("btn").text(this.label);

        return container;
    }

    static setTheme(theme: ThemeManager): void {
        Button.theme = theme;
    }

    static getTheme(): ThemeManager {
        return Button.theme;
    }
}
