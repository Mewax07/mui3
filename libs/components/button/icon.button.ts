import { Component, Html, placeholder, prop } from "../../utils";
import {
    WithEnumMethod,
    WithPlaceholderMethods,
    WithPropMethods,
} from "../../utils/types";
import {
    ButtonIconBorderType,
    ButtonIconSize,
    ButtonIconType,
    ButtonIconTypeIcon,
} from "./icon.button.style";

interface ButtonIconProps {
    icon: string;
    iconType: "outlined" | "rounded";
    disabled: boolean;
}

interface ButtonIconSlots {
    link: { type: "text" };
}

export interface ButtonIcon
    extends
        WithPropMethods<ButtonIconProps, ButtonIcon>,
        WithEnumMethod<"type", ButtonIconType, ButtonIcon>,
        WithEnumMethod<"size", ButtonIconSize, ButtonIcon>,
        WithEnumMethod<"border", ButtonIconBorderType, ButtonIcon>,
        WithPlaceholderMethods<ButtonIconSlots, ButtonIcon> {}

export class ButtonIcon extends Component {
    @prop("enum", {
        enumValues: ButtonIconType,
    })
    private type: ButtonIconType = ButtonIconType.FILLED;

    @prop("enum", {
        enumValues: ButtonIconSize,
    })
    private size: ButtonIconSize = ButtonIconSize.SMALL;

    @prop("enum", {
        enumValues: ButtonIconBorderType,
    })
    private border: ButtonIconBorderType = ButtonIconBorderType.DEFAULT;

    @prop("enum", {
        enumValues: ButtonIconTypeIcon,
    })
    private iconType: ButtonIconTypeIcon = ButtonIconTypeIcon.OUTLINED;

    @prop("string")
    private icon: string = "home";

    @prop("boolean", {
        defaultValue: false,
    })
    private disabled: boolean = false;

    @placeholder("text")
    private linkSlot?: string;

    constructor(icon: string) {
        super("button");
        this.icon = icon;
    }

    protected template(): Html {
        const container = new Html<HTMLButtonElement>("button")
            .class("ibtn")
            .dataset("type", this.type)
            .dataset("size", this.size)
            .dataset("border", this.border);

        const link = this.getPlaceholder("link");
        if (link) {
            console.log(link.getText());
            container.on("click", () => {
                window.open(link.getText(), "_about")?.focus();
            });
        }

        container.append(
            new Html("span")
                .class(`material-symbols-${this.iconType}`)
                .text(this.icon),
        );

        if (this.disabled) {
            container.elm.disabled = true;
        }

        return container;
    }
}
