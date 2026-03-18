import {
    ButtonIcon,
    ButtonIconBorderType,
    ButtonIconSize,
    ButtonIconType,
    darkTheme,
    Html,
    Style,
} from "../../../libs";

darkTheme.applyCSSVariables();

const variant_buttons = [
    new ButtonIcon("volume_up").setType(ButtonIconType.FILLED).mount(),
    new ButtonIcon("volume_up").setType(ButtonIconType.TONAL).mount(),
    new ButtonIcon("volume_up").setType(ButtonIconType.OUTLINED).mount(),
    new ButtonIcon("volume_up").setType(ButtonIconType.STANDARD).mount(),
];

const size_buttons = [
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.TONAL)
        .setSize(ButtonIconSize.EXTRA_SMALL)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.TONAL)
        .setSize(ButtonIconSize.SMALL)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.TONAL)
        .setSize(ButtonIconSize.MEDIUM)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.TONAL)
        .setSize(ButtonIconSize.LARGE)
        .mount(),
    new ButtonIcon("play_arrow")
        .setType(ButtonIconType.TONAL)
        .setSize(ButtonIconSize.EXTRA_LARGE)
        .mount(),
];

const width_buttons = [
    new ButtonIcon("more_vert")
        .setType(ButtonIconType.OUTLINED)
        .setBorder(ButtonIconBorderType.NARROW)
        .mount(),
    new ButtonIcon("more_vert")
        .setType(ButtonIconType.OUTLINED)
        .setBorder(ButtonIconBorderType.DEFAULT)
        .mount(),
    new ButtonIcon("more_vert")
        .setType(ButtonIconType.OUTLINED)
        .setBorder(ButtonIconBorderType.WIDE)
        .mount(),
];

const disabled_buttons = [
    new ButtonIcon("volume_off")
        .setType(ButtonIconType.STANDARD)
        .setDisabled()
        .mount(),
];

const link_buttons = [
    new ButtonIcon("home")
        .setType(ButtonIconType.TONAL)
        .setLinkSlot("https://m3.material.io/components/icon-buttons/overview")
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
    .append(new Html("h1").text("Width"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(width_buttons)),
    )
    .append(new Html("h1").text("Disabled"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(disabled_buttons)),
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
