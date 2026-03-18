import { darkTheme, Style } from "../../utils";

export enum ShapeType {
    CIRCLE = "circle",
    SQUARE = "square",
}

const type_config: Record<ShapeType, (s: Style) => Style> = {
    [ShapeType.CIRCLE]: (s) => {
        return s.themeRadius("full");
    },
    [ShapeType.SQUARE]: (s) => {
        return s.themeRadius("md");
    },
};

const shape = new Style(".shape")
    .withTheme(darkTheme)
    // @theme-start
    .themeBgColor("primary")
    .themeColor("on_primary")
    // @theme-end
    // @var-start
    .w(40)
    .h(40);
// @var-end
Object.entries(type_config).forEach(([type, applyFn]) => {
    applyFn(
        new Style(`.shape[data-shape="${type}"]`).withTheme(darkTheme),
    ).apply();
});

shape.apply();
