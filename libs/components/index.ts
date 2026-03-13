import { Style } from "../utils/style";
import { darkTheme } from "../utils/theme";

export * from "./bar";
export * from "./button";

new Style("body")
	.withTheme(darkTheme)
	.themeBgColor("background")
	.themeColor("on_background")
	.themeFontSize("lg")
	.apply();
