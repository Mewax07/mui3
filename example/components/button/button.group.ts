import {
    ButtonGroup,
    ButtonGroupSize,
    ButtonGroupType,
    darkTheme,
    Html,
    Style,
} from "../../../libs";

darkTheme.applyCSSVariables();

const variants_buttons = [
    new ButtonGroup()
        .setType(ButtonGroupType.CONNECTED)
        .setSize(ButtonGroupSize.EXTRA_SMALL)
        .addButton("start", {
            kind: "button",
            label: "Start",
        })
        .addButton("directins", {
            kind: "button",
            label: "Directions",
        })
        .addButton("share", {
            kind: "button",
            label: "Share",
        })
        .mount(),
    new ButtonGroup()
        .setType(ButtonGroupType.CONNECTED)
        .setSize(ButtonGroupSize.SMALL)
        .addButton("start", {
            kind: "button",
            label: "Start",
        })
        .addButton("directins", {
            kind: "button",
            label: "Directions",
        })
        .addButton("share", {
            kind: "button",
            label: "Share",
        })
        .mount(),
    new ButtonGroup()
        .setType(ButtonGroupType.CONNECTED)
        .setSize(ButtonGroupSize.MEDIUM)
        .addButton("start", {
            kind: "button",
            label: "Start",
        })
        .addButton("directins", {
            kind: "button",
            label: "Directions",
        })
        .addButton("share", {
            kind: "button",
            label: "Share",
        })
        .mount(),
    new ButtonGroup()
        .setSize(ButtonGroupSize.EXTRA_SMALL)
        .addButton("start", {
            kind: "button",
            label: "Start",
        })
        .addButton("directins", {
            kind: "button",
            label: "Directions",
        })
        .addButton("share", {
            kind: "button",
            label: "Share",
        })
        .mount(),
];

new Html()
    .class("content")
    .append(new Html("h1").text("Variant"))
    .append(
        new Html()
            .class("code-preview")
            .append(
                new Html()
                    .class("wrap")
                    .styleJs({ flexDirection: "column" })
                    .appendMany(variants_buttons),
            ),
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
