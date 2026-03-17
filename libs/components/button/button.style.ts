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
        return s.themeFont("label", "lg").themeRadius("md").h(32).pi(12).gap(4);
    },
    [ButtonSize.SMALL]: (s) => {
        return s.themeFont("label", "lg").themeRadius("md").h(40).pi(16).gap(8);
    },
    [ButtonSize.MEDIUM]: (s) => {
        return s.themeFont("title", "md").themeRadius("lg").h(56).pi(24).gap(8);
    },
    [ButtonSize.LARGE]: (s) => {
        return s
            .themeFont("headline", "sm")
            .themeRadius("xl")
            .h(96)
            .pi(48)
            .gap(12);
    },
    [ButtonSize.EXTRA_LARGE]: (s) => {
        return s
            .themeFont("headline", "lg")
            .themeRadius("xl")
            .h(136)
            .pi(64)
            .gap(16);
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
            .bgColor("transparent")
            .themeColor("primary")
            .hover((hover) => {
                hover.bgColor(
                    "color-mix(in srgb, currentColor 8%, transparent)",
                );
            });
    },
    [ButtonType.OUTLINED]: (s) => {
        return s
            .bgColor("transparent")
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
    .themeColor("on_primary")
    .themeFont("label", "lg")
    .themeRadius("sm")
    // @theme-end
    // @var-start
    .h(40)
    .pi(16)
    .gap(8)
    // @var-end
    .cursor("pointer")
    .w("max-content")
    .position("relative")
    .textDecoration("none")
    .border(1, "solid", "transparent")
    .css({ outlineOffset: "1px", outline: "10px solid transparent" })
    .display("flex")
    .alignItems("center")
    .justifyContent("center")
    .bgColor("transparent")
    .bgRepeat("no-repeat")
    .bgPosition("center");

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
        .color("color-mix(in srgb, $on_surface$ 38%, transparent)")
        .bgColor("color-mix(in srgb, $on_surface$ 10%, transparent)");
});

btn.active((s) => {
    s.themeBgImage("circle").animation(
        "button-ripple .5s cubic-bezier(.38, 1.21, .22, 1) forwards",
    );
});

btn.apply();
