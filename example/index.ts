import { Button, ButtonType, Html } from "../libs";

const buttons = [
    new Button().setLabel("Elevated").setType(ButtonType.ELEVATED).mount(),
    new Button().setLabel("Filled").setType(ButtonType.FILLED).mount(),
    new Button().setLabel("Tonal").setType(ButtonType.TONAL).mount(),
    new Button().setLabel("Text").setType(ButtonType.TEXT).mount(),
    new Button().setLabel("Outlined").setType(ButtonType.OUTLINED).mount(),
];

new Html().appendMany(buttons).appendTo(document.body);
