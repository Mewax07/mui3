import { Component } from "../../utils/component";
import { placeholder, prop } from "../../utils/decorator";
import { Html } from "../../utils/html";
import {
    WithEnumMethod,
    WithPlaceholderMethods,
    WithPropMethods,
} from "../../utils/types";
import { ButtonBorderType, ButtonSize, ButtonType } from "./button.style";

interface ButtonProps {
    label: string;
    disabled: boolean;
}

interface ButtonSlots {
    icon: { type: "icon" };
}

export interface Button
    extends
        WithPropMethods<ButtonProps, Button>,
        WithEnumMethod<"type", ButtonType, Button>,
        WithEnumMethod<"size", ButtonSize, Button>,
        WithEnumMethod<"border", ButtonBorderType, Button>,
        WithPlaceholderMethods<ButtonSlots, Button> {}

export class Button extends Component {
    @prop("enum", {
        enumValues: ButtonType,
    })
    private type: ButtonType = ButtonType.FILLED;

    @prop("enum", {
        enumValues: ButtonSize,
    })
    private size: ButtonSize = ButtonSize.SMALL;

    @prop("enum", {
        enumValues: ButtonBorderType,
    })
    private border: ButtonBorderType = ButtonBorderType.SQUARE;

    @prop("string")
    private label: string = "text";

    @prop("boolean", {
        defaultValue: false,
    })
    private disabled: boolean = false;

    @placeholder("icon")
    private iconSlot?: Html;

    constructor() {
        super("button");
    }

    protected template(): Html {
        const container = new Html<HTMLButtonElement>("button")
            .class("btn")
            .dataset("type", this.type)
            .dataset("size", this.size)
            .dataset("border", this.border);

        const icon = this.getPlaceholder("icon");
        if (icon) {
            container.append(icon);
        }

        container.append(new Html("span").text(this.label));

        if (this.disabled) {
            container.elm.disabled = true;
        }

        return container;
    }
}
