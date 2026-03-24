import { Html } from "../utils";
import { Style } from "../utils/style";
import { darkTheme } from "../utils/theme";

export * from "./bar";
export * from "./button";
export * from "./shape";

new Style("body")
    .withTheme(darkTheme)
    .themeBgColor("background")
    .themeColor("on_background")
    .themeFont("body", "md")
    .apply();

const script = new Html<HTMLScriptElement>("script");
script.elm.src =
    "https://cdn.jsdelivr.net/npm/flubber@0.4.2/build/flubber.min.js";
script.elm.defer = true;
script.appendTo(document.body);
