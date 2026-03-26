import { darkTheme, Html, Style } from "../libs";
import { ButtonGroup } from "../libs/components/button/group.button";

darkTheme.applyCSSVariables();

const groupStandardButton = new ButtonGroup()
    .addButton("bluetooth", {
        kind: "icon",
        icon: "bluetooth",
        type: "rounded",
    })
    .addButton("alarm", {
        kind: "icon",
        icon: "alarm",
        type: "rounded",
    })
    .addButton("home", {
        kind: "icon",
        icon: "home",
        type: "rounded",
    });

const groupConnectedButton = new ButtonGroup("connected")
    .addButton("value1", {
        kind: "button",
        label: "8 oz",
    })
    .addButton("value2", {
        kind: "button",
        label: "12 oz",
    })
    .addButton("value3", {
        kind: "button",
        label: "16 oz",
    })
    .addButton("value4", {
        kind: "button",
        label: "20 oz",
    });

new Html()
    .class("content")
    .append(new Html().class("preview").append(groupStandardButton.mount()))
    .append(new Html().class("preview").append(groupConnectedButton.mount()))
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
