import { Component } from "../../utils/component";
import { prop } from "../../utils/decorator";
import { Html } from "../../utils/html";
import { WithEnumMethod, WithPropMethods } from "../../utils/types";
import { ButtonBorderType, ButtonSize, ButtonType } from "./button.style";

interface ButtonProps {
	label: string;
	disabled: boolean;
}

export interface Button
	extends
		WithPropMethods<ButtonProps, Button>,
		WithEnumMethod<"type", ButtonType, Button>,
		WithEnumMethod<"size", ButtonSize, Button>,
		WithEnumMethod<"border", ButtonBorderType, Button> {}

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

	constructor() {
		super();
	}

	protected template(): Html {
		const container = new Html<HTMLButtonElement>("button")
			.class("btn")
			.dataset("type", this.type)
			.dataset("size", this.size)
			.dataset("border", this.border)
			.text(this.label);

		container.elm.disabled = this.disabled;

		return container;
	}
}
