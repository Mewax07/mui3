import { Style } from "../../utils/style";
import { darkTheme } from "../../utils/theme";

const BASE = 4;
const px = (n: number) => n * BASE;

const SIZE_SCALE: Record<ButtonIconSize, number> = {
    xs: 8,
    sm: 10,
    md: 14,
    lg: 24,
    xl: 34,
};

const WIDTH_RATIO: Record<ButtonIconBorderType, number> = {
    narrow: 0.8,
    default: 1,
    wide: 1.4,
};

const buildIcon = (s: Style, scale: number) => {
    const size = px(scale);
    return s
        .w(size)
        .h(size)
        .child("> span", (s) => {
            return s.fontSize(Math.round(size * 0.5));
        });
};

export enum ButtonIconType {
    FILLED = "filled",
    TONAL = "tonal",
    OUTLINED = "outlined",
    STANDARD = "standard",
}

export enum ButtonIconSize {
    EXTRA_SMALL = "xs",
    SMALL = "sm",
    MEDIUM = "md",
    LARGE = "lg",
    EXTRA_LARGE = "xl",
}

export enum ButtonIconTypeIcon {
    OUTLINED = "outlined",
    ROUNDED = "rounded",
    // Sharp: add later
}

export enum ButtonIconBorderType {
    NARROW = "narrow",
    DEFAULT = "default",
    WIDE = "wide",
}

const type_config: Record<ButtonIconType, (s: Style) => Style> = {
    [ButtonIconType.FILLED]: (s) =>
        s
            .themeBgColor("primary")
            .themeColor("on_primary")
            .hover((h) =>
                h.bgColor("color-mix(in srgb, $primary$ 92%, transparent)"),
            ),

    [ButtonIconType.TONAL]: (s) =>
        s
            .themeBgColor("secondary_container")
            .themeColor("on_secondary_container")
            .hover((h) =>
                h.bgColor(
                    "color-mix(in srgb, currentColor 8%, $secondary_container$)",
                ),
            ),

    [ButtonIconType.OUTLINED]: (s) =>
        s
            .themeBorderColor("surface_variant")
            .themeColor("on_surface_variant")
            .hover((h) =>
                h.bgColor("color-mix(in srgb, currentColor 8%, transparent)"),
            ),

    [ButtonIconType.STANDARD]: (s) =>
        s
            .bgColor("transparent")
            .themeColor("on_surface_variant")
            .hover((h) =>
                h.bgColor("color-mix(in srgb, currentColor 8%, transparent)"),
            ),
};

const border_config: Record<ButtonIconBorderType, (s: Style) => Style> = {
    [ButtonIconBorderType.NARROW]: (s) => {
        return s;
    },
    [ButtonIconBorderType.DEFAULT]: (s) => {
        return s;
    },
    [ButtonIconBorderType.WIDE]: (s) => {
        return s;
    },
};

const ibtn = new Style(".ibtn")
    .withTheme(darkTheme)
    // @theme-start
    .themeColor("on_secondary_container")
    // @theme-end
    // @var-start
    .h(40)
    .w(40)
    .fontSize(24)
    // @var-end
    .cursor("pointer")
    .position("relative")
    .border(1, "solid", "transparent")
    .css({ outlineOffset: "1px", outline: "10px solid transparent" })
    .display("flex")
    .alignItems("center")
    .justifyContent("center")
    .bgColor("transparent")
    .bgRepeat("no-repeat")
    .bgPosition("center")
    .themeRadius("full");

Object.entries(type_config).forEach(([type, applyFn]) => {
    applyFn(
        new Style(`.ibtn[data-type="${type}"]`).withTheme(darkTheme),
    ).apply();
});

Object.entries(SIZE_SCALE).forEach(([size, scale]) => {
    const base = new Style(`.ibtn[data-size="${size}"]`).withTheme(darkTheme);

    buildIcon(base, scale).apply();

    const baseSize = px(scale);

    Object.entries(WIDTH_RATIO).forEach(([variant, ratio]) =>
        new Style(`.ibtn[data-size="${size}"][data-border="${variant}"]`)
            .withTheme(darkTheme)
            .w(Math.round(baseSize * ratio))
            .apply(),
    );
});

Object.entries(border_config).forEach(([radius, applyFn]) => {
    applyFn(
        new Style(`.ibtn[data-border="${radius}"]`).withTheme(darkTheme),
    ).apply();
});

ibtn.disabled((s) => {
    s.pointerEvents("none")
        .color("color-mix(in srgb, $on_surface$ 38%, transparent)")
        .bgColor("color-mix(in srgb, $on_surface$ 10%, transparent)");
});

ibtn.active((s) => {
    s.themeBgImage("full");
});

ibtn.apply();
