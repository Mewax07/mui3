import {
    Button,
    ButtonBorderType,
    ButtonIcon,
    ButtonIconBorderType,
    ButtonIconSize,
    ButtonIconType,
    ButtonSize,
    ButtonType,
    darkTheme,
    Html,
} from "../libs";
import { Shape } from "../libs/components/shape/shape";

darkTheme.applyCSSVariables();

const buttons = [
    new Button("Elevated")
        .setType(ButtonType.ELEVATED)
        .setBorder(ButtonBorderType.SQUARE)
        .mount(),
    new Button("Elevated")
        .setType(ButtonType.ELEVATED)
        .setBorder(ButtonBorderType.ROUND)
        .setSize(ButtonSize.MEDIUM)
        .mount(),
    new Button("Elevated")
        .setType(ButtonType.ELEVATED)
        .setSize(ButtonSize.LARGE)
        .setIconSlot("arrow_back")
        .mount(),
    new Button("Filled")
        .setType(ButtonType.FILLED)
        .setBorder(ButtonBorderType.ROUND)
        .setSize(ButtonSize.EXTRA_SMALL)
        .mount(),
    new Button("Filled")
        .setType(ButtonType.FILLED)
        .setBorder(ButtonBorderType.SQUARE)
        .mount(),
    new Button("Filled")
        .setType(ButtonType.FILLED)
        .setBorder(ButtonBorderType.ROUND)
        .setSize(ButtonSize.MEDIUM)
        .setDisabled()
        .mount(),
    new Button("Tonal").setType(ButtonType.TONAL).mount(),
    new Button("Text")
        .setType(ButtonType.TEXT)
        .setBorder(ButtonBorderType.ROUND)
        .mount(),
    new Button("Outlined").setType(ButtonType.OUTLINED).mount(),
];

const icons_buttons = [
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.OUTLINED)
        .setBorder(ButtonIconBorderType.NARROW)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.TONAL)
        .setBorder(ButtonIconBorderType.DEFAULT)
        .setSize(ButtonIconSize.MEDIUM)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.STANDARD)
        .setSize(ButtonIconSize.LARGE)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.FILLED)
        .setBorder(ButtonIconBorderType.WIDE)
        .setSize(ButtonIconSize.EXTRA_SMALL)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.FILLED)
        .setBorder(ButtonIconBorderType.NARROW)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.FILLED)
        .setBorder(ButtonIconBorderType.WIDE)
        .setSize(ButtonIconSize.MEDIUM)
        .setDisabled()
        .mount(),
    new ButtonIcon("play_arrow").setType(ButtonIconType.TONAL).mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.STANDARD)
        .setBorder(ButtonIconBorderType.DEFAULT)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.OUTLINED)
        .setLinkSlot("https://youtube.com/")
        .mount(),
];

const shapes = [
    new Shape("circle").mount(), // good
    new Shape("square").mount(), // good
];

new Html()
    .appendMany(buttons)
    .appendMany(icons_buttons)
    .appendMany(shapes)
    // .append(new AppsBar().setIconSlot("arrow_back").mount())
    .appendTo(document.body);
