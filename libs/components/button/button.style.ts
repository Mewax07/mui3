import { Style } from "../../utils/style";
import { darkTheme } from "../../utils/theme";

export enum ButtonType {
	ELEVATED = "elevated",
	FILLED = "filled",
	TONAL = "tonal",
	OUTLINED = "outlined",
	TEXT = "text",
}

export enum ButtonSize {
	EXTRA_SMALL = "xs",
	SMALL = "sm",
	MEDIUM = "md",
	LARGE = "lg",
	EXTRA_LARGE = "xl",
}

export enum ButtonBorderType {
	ROUND = "round",
	SQUARE = "square",
}

const size_config: Record<ButtonSize, (s: Style) => Style> = {
	[ButtonSize.EXTRA_SMALL]: (s) => {
		return s.themeFontSize("xs").themeRadius("md").h(32).pi(12).gap(4);
	},
	[ButtonSize.SMALL]: (s) => {
		return s.themeFontSize("sm").themeRadius("md").h(40).pi(16).gap(8);
	},
	[ButtonSize.MEDIUM]: (s) => {
		return s.themeFontSize("md").themeRadius("lg").h(56).pi(24).gap(8);
	},
	[ButtonSize.LARGE]: (s) => {
		return s.themeFontSize("lg").themeRadius("xl").h(96).pi(48).gap(12);
	},
	[ButtonSize.EXTRA_LARGE]: (s) => {
		return s.themeFontSize("xl").themeRadius("xl").h(136).pi(64).gap(16);
	},
};

const type_config: Record<ButtonType, (s: Style) => Style> = {
	[ButtonType.ELEVATED]: (s) => {
		return s
			.themeBgColor("surface_container_lowest")
			.themeColor("primary")
			.hover((hover) => {
				hover.bgColor(
					"color-mix(in srgb, currentColor 8%, transparent)",
				);
			});
	},
	[ButtonType.FILLED]: (s) => {
		return s
			.themeBgColor("primary")
			.themeColor("on_primary")
			.hover((hover) => {
				hover.bgColor("color-mix(in srgb, $primary$ 92%, transparent)");
			});
	},
	[ButtonType.TONAL]: (s) => {
		return s
			.themeBgColor("secondary_container")
			.themeColor("on_secondary_container")
			.hover((hover) => {
				hover.bgColor(
					"color-mix(in srgb, currentColor 8%, $secondary_container$)",
				);
			});
	},
	[ButtonType.TEXT]: (s) => {
		return s
			.bg("transparent")
			.themeColor("primary")
			.hover((hover) => {
				hover.bgColor(
					"color-mix(in srgb, currentColor 8%, transparent)",
				);
			});
	},
	[ButtonType.OUTLINED]: (s) => {
		return s
			.bg("transparent")
			.themeColor("on_surface_variant")
			.themeBorderColor("outline_variant")
			.hover((hover) => {
				hover.bgColor(
					"color-mix(in srgb, currentColor 8%, transparent)",
				);
			});
	},
};

const border_config: Record<ButtonBorderType, (s: Style) => Style> = {
	[ButtonBorderType.ROUND]: (s) => {
		return s.themeRadius("full");
	},
	[ButtonBorderType.SQUARE]: (s) => {
		return s;
	},
};

const btn = new Style(".btn")
	.withTheme(darkTheme)
	// @theme-start
	.themeBgColor("primary")
	.themeColor("on_primary")
	.themeFontSize("sm")
	.themeRadius("sm")
	// @theme-end
	// @var-start
	.h(40)
	.pi(16)
	.gap(8)
	// @var-end
	.cursor("pointer")
	.position("relative")
	.w("max-content")
	.border(1, "solid", "transparent")
	.display("flex")
	.alignItems("center")
	.justifyContent("center")
	.bgRepeat("no-repeat")
	.bgPosition("center")
	.apply();

Object.entries(type_config).forEach(([type, applyFn]) => {
	applyFn(
		new Style(`.btn[data-type="${type}"]`).withTheme(darkTheme),
	).apply();
});

Object.entries(size_config).forEach(([size, applyFn]) => {
	applyFn(
		new Style(`.btn[data-size="${size}"]`).withTheme(darkTheme),
	).apply();
});

Object.entries(border_config).forEach(([radius, applyFn]) => {
	applyFn(
		new Style(`.btn[data-border="${radius}"]`).withTheme(darkTheme),
	).apply();
});

btn.disabled((s) => {
	s.pointerEvents("none")
		.color("color-mix(in srgb, %on_surface% 38%, transparent)")
		.bgColor("color-mix(in srgb, %on_surface% 10%, transparent)");
}).apply();
