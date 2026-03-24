import { Component, Html, prop } from "../../utils";
import { WithEnumMethod, WithPropMethods } from "../../utils/types";
import { AnyButtonConfig, buttonFactory } from "./config";
import { ButtonGroupSize, ButtonGroupType } from "./group.button.icon";
import { ButtonIcon } from "./icon.button";

interface ButtonGroupProps {
    icon: boolean;
    disabled: boolean;
}

export interface Button
    extends
        WithPropMethods<ButtonGroupProps, Button>,
        WithEnumMethod<"type", ButtonGroupType, Button>,
        WithEnumMethod<"size", ButtonGroupSize, Button> {}

export class ButtonGroup extends Component {
    @prop("enum", {
        enumValues: ButtonGroupType,
    })
    private type: ButtonGroupType = ButtonGroupType.STANDARD;

    @prop("enum", {
        enumValues: ButtonGroupSize,
    })
    private size: ButtonGroupSize = ButtonGroupSize.SMALL;

    private buttonList: Map<string, Component> = new Map();

    constructor() {
        super();
    }

    protected template(): Html {
        const container = new Html()
            .class("gbtn")
            .dataset("type", this.type)
            .dataset("size", this.size);

        this.buttonList.forEach((btn) => {
            container.append(btn.mount());
        });

        return container;
    }

    addButton<T extends AnyButtonConfig>(id: string, config: T): this {
        const instance = buttonFactory[config.kind];
        // @ts-expect-error Trust the process bro
        const btn = new instance();

        if (config.kind === "button") {
            // @ts-ignore force cast for icon
            (btn as Button).setLabel(config.label);
        } else if (config.kind === "icon") {
            // @ts-ignore force cast for icon
            (btn as ButtonIcon).setIcon(config.icon).setIconType(config.type);
        }

        if (config.disabled) {
            // @ts-ignore optional method
            btn.disabled?.(true);
        }

        this.buttonList.set(id, btn);
        return this;
    }

    removeButton(id: string): this {
        this.buttonList.delete(id);
        return this;
    }
}
