import { AppsBar, Button, ButtonType, Html } from "../libs";
import {
	ButtonBorderType,
	ButtonSize,
} from "../libs/components/button/button.style";

const buttons = [
	new Button()
		.setLabel("Elevated")
		.setType(ButtonType.ELEVATED)
		.setBorder(ButtonBorderType.SQUARE)
		.mount(),
	new Button()
		.setLabel("Elevated")
		.setType(ButtonType.ELEVATED)
		.setBorder(ButtonBorderType.ROUND)
		.setSize(ButtonSize.MEDIUM)
		.mount(),
	new Button()
		.setLabel("Elevated")
		.setType(ButtonType.ELEVATED)
		.setSize(ButtonSize.LARGE)
		.mount(),
	new Button()
		.setLabel("Filled")
		.setType(ButtonType.FILLED)
		.setBorder(ButtonBorderType.ROUND)
		.setSize(ButtonSize.EXTRA_SMALL)
		.mount(),
	new Button()
		.setLabel("Filled")
		.setType(ButtonType.FILLED)
		.setBorder(ButtonBorderType.SQUARE)
		.mount(),
	new Button()
		.setLabel("Filled")
		.setType(ButtonType.FILLED)
		.setBorder(ButtonBorderType.ROUND)
		.setDisabled()
		.mount(),
	new Button().setLabel("Tonal").setType(ButtonType.TONAL).mount(),
	new Button()
		.setLabel("Text")
		.setType(ButtonType.TEXT)
		.setBorder(ButtonBorderType.ROUND)
		.mount(),
	new Button().setLabel("Outlined").setType(ButtonType.OUTLINED).mount(),
];

new Html()
	.appendMany(buttons)
	// .append(new AppsBar().mount())
	.appendTo(document.body);
