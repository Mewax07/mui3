import {
    Button,
    ButtonBorderType,
    ButtonSize,
    ButtonType,
    darkTheme,
    Html,
    Style,
} from "../../../libs";

darkTheme.applyCSSVariables();

const variant_buttons = [
    new Button().setLabel("Elevated").setType(ButtonType.ELEVATED).mount(),
    new Button().setLabel("Filled").setType(ButtonType.FILLED).mount(),
    new Button().setLabel("Tonal").setType(ButtonType.TONAL).mount(),
    new Button().setLabel("Text").setType(ButtonType.TEXT).mount(),
    new Button().setLabel("Outlined").setType(ButtonType.OUTLINED).mount(),
];

const size_buttons = [
    new Button()
        .setLabel("Extra small")
        .setType(ButtonType.TONAL)
        .setSize(ButtonSize.EXTRA_SMALL)
        .mount(),
    new Button()
        .setLabel("Small")
        .setType(ButtonType.TONAL)
        .setSize(ButtonSize.SMALL)
        .mount(),
    new Button()
        .setLabel("Medium")
        .setType(ButtonType.TONAL)
        .setSize(ButtonSize.MEDIUM)
        .mount(),
    new Button()
        .setLabel("Large")
        .setType(ButtonType.TONAL)
        .setSize(ButtonSize.LARGE)
        .mount(),
    new Button()
        .setLabel("Extra large")
        .setType(ButtonType.TONAL)
        .setSize(ButtonSize.EXTRA_LARGE)
        .mount(),
];

const rounded_buttons = [
    new Button()
        .setLabel("Round")
        .setType(ButtonType.OUTLINED)
        .setBorder(ButtonBorderType.ROUND)
        .mount(),
    new Button()
        .setLabel("Square")
        .setType(ButtonType.OUTLINED)
        .setBorder(ButtonBorderType.SQUARE)
        .mount(),
];

const disabled_buttons = [
    new Button()
        .setLabel("Disabled")
        .setType(ButtonType.FILLED)
        .setDisabled()
        .mount(),
];

const with_icon_buttons = [
    new Button()
        .setLabel("Button")
        .setType(ButtonType.FILLED)
        .setIconSlot("edit")
        .mount(),
];

const link_buttons = [
    new Button()
        .setLabel("View reference")
        .setType(ButtonType.OUTLINED)
        .setLinkSlot("https://m3.material.io/components/buttons/overview")
        .mount(),
];

new Html()
    .append(new Html("h1").text("Variant"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(variant_buttons)),
    )
    .append(new Html("h1").text("Size"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(size_buttons)),
    )
    .append(new Html("h1").text("Rounded"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(rounded_buttons)),
    )
    .append(new Html("h1").text("Disabled"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(disabled_buttons)),
    )
    .append(new Html("h1").text("With Icon"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(with_icon_buttons)),
    )
    .append(new Html("h1").text("Link"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(link_buttons)),
    )
    .appendTo(document.body);

new Style("body")
    .m(15)
    .p(10)
    .child(".code-preview", (s) => {
        return s
            .minW(260)
            .w(100, "%")
            .h(400)
            .borderRadius(15)
            .display("flex")
            .alignItems("center")
            .justifyContent("center")
            .bgColor("#201F23")
            .bgImage(
                "linear-gradient(#363438 1px, transparent 1px), linear-gradient(to right, #2B292D 1px, transparent 1px)",
            )
            .bgSize("50px 50px")
            .overflow("auto")
            .gap(8);
    })
    .child(".wrap", (s) => {
        return s
            .flexWrap("wrap")
            .display("flex")
            .alignItems("center")
            .justifyContent("center")
            .gap(24);
    })
    .apply();
