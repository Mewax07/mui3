import { darkTheme, Style } from "../../utils";

export enum ShapeType {
    CIRCLE = "circle",
    SQUARE = "square",
    SLANTED = "slanted",
    ARCH = "arch",
}

const type_config: Record<ShapeType, (s: Style) => Style> = {
    [ShapeType.CIRCLE]: (s) => {
        return s.roundedFull();
    },
    [ShapeType.SQUARE]: (s) => {
        return s.borderRadius(25, "%");
    },
    [ShapeType.SLANTED]: (s) => {
        return s.borderRadius(25, "%").transform("skewX(-5deg)");
    },
    [ShapeType.ARCH]: (s) => {
        return s.css({
            aspectRatio: "1 / 1",
            borderRadius: "50% 50% 15% 15%",
        });
    },
};

const shape = new Style(".shape")
    .withTheme(darkTheme)
    // @theme-start
    .themeBgColor("primary")
    .themeColor("on_primary")
    // @theme-end
    // @var-start
    .w(80)
    .h(80);
// @var-end
Object.entries(type_config).forEach(([type, applyFn]) => {
    applyFn(
        new Style(`.shape[data-shape="${type}"]`).withTheme(darkTheme),
    ).apply();
});

shape.apply();
