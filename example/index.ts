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
    Style,
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

const shapes_line1 = [
    new Shape("circle").mount(), // good
    new Shape("square").mount(), // good
    new Shape("slanted").mount(), // good
    new Shape("arch").mount(), // good
    new Shape("semicircle").mount(), // good
];

const shapes_line2 = [
    new Shape("oval").mount(), // good
    new Shape("pil").mount(), // good
    new Shape("triangle").mount(), // good
    new Shape("arrow").mount(), // good
    new Shape("fan").mount(), // good
];

const shapes_line3 = [
    new Shape("diamond").mount(), // good
    new Shape("clamshell").mount(), // good
    new Shape("pentagon").mount(), // good
    new Shape("gem").mount(), // good
    new Shape("very_sunny").mount(), // good
];

const shapes_line4 = [
    new Shape("sunny").mount(), // good
    new Shape("4_sided_cookie").mount(), // good
    new Shape("6_sided_cookie").mount(), // good
    new Shape("7_sided_cookie").mount(), // good
    new Shape("9_sided_cookie").mount(), // good
];

const shapes_line5 = [
    new Shape("12_sided_cookie").mount(), // good
    new Shape("4_leaf").mount(), // good
    new Shape("8_leaf").mount(), // good
    new Shape("brust").mount(), // good
    new Shape("soft_brust").mount(), // good
];

const shapes_line6 = [
    new Shape("boom").mount(), // good
    new Shape("soft_boom").mount(), // good
    new Shape("flower").mount(), // good
    new Shape("puffy").mount(), // good
    new Shape("puffy_diamond").mount(), // good
];

const shapes_line7 = [
    new Shape("ghost_ish").mount(), // good
    new Shape("pixel_circle").mount(), // good
    new Shape("pixel_triangle").mount(), // good
    new Shape("bun").mount(), // good
    new Shape("heart").mount(), // good
];

new Html()
    .class("content")
    // .append(new Html().class("preview").appendMany(buttons))
    // .append(new Html().class("preview").appendMany(icons_buttons))
    .append(new Html().class("preview").appendMany(shapes_line1))
    .append(new Html().class("preview").appendMany(shapes_line2))
    .append(new Html().class("preview").appendMany(shapes_line3))
    .append(new Html().class("preview").appendMany(shapes_line4))
    .append(new Html().class("preview").appendMany(shapes_line5))
    .append(new Html().class("preview").appendMany(shapes_line6))
    .append(new Html().class("preview").appendMany(shapes_line7))
    // .append(new AppsBar().setIconSlot("arrow_back").mount())
    .appendTo(document.body);

new Style("body")
    .m(0)
    .p(0)
    .w(100, "vw")
    .h(100, "vh")
    .child(".content", (s) => {
        return s
            .display("flex")
            .alignItems("center")
            .justifyContent("center")
            .flexDirection("column")
            .gap(5)
            .w(100, "%")
            .h(100, "%");
    })
    .child(".preview", (s) => {
        return s
            .display("flex")
            .alignItems("center")
            .justifyContent("center")
            .p(4, "%")
            .bgColor("#201F23")
            .bgImage(
                "linear-gradient(#363438 1px, transparent 1px), linear-gradient(to right, #2B292D 1px, transparent 1px)",
            )
            .bgSize("50px 50px")
            .overflow("auto")
            .borderRadius(15)
            .gap(15);
    })
    .apply();
