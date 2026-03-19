import { darkTheme, Html, Shape, Style } from "../../../libs";

darkTheme.applyCSSVariables();

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
    .append(new Html("h1").text("Shape Line 1 (ref below)"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(shapes_line1)),
    )
    .append(new Html("h1").text("Shape Line 2 (ref below)"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(shapes_line2)),
    )
    .append(new Html("h1").text("Shape Line 3 (ref below)"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(shapes_line3)),
    )
    .append(new Html("h1").text("Shape Line 4 (ref below)"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(shapes_line4)),
    )
    .append(new Html("h1").text("Shape Line 5 (ref below)"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(shapes_line5)),
    )
    .append(new Html("h1").text("Shape Line 6 (ref below)"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(shapes_line6)),
    )
    .append(new Html("h1").text("Shape Line 7 (ref below)"))
    .append(
        new Html()
            .class("code-preview")
            .append(new Html().class("wrap").appendMany(shapes_line7)),
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
