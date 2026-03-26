import { darkTheme, Style } from "../../utils";
import { BasicSize } from "./config";

export enum ButtonGroupType {
    STANDARD = "standard",
    CONNECTED = "connected",
}

export const ButtonGroupSize = {
    ...BasicSize,
} as const;

export type ButtonGroupSize =
    (typeof ButtonGroupSize)[keyof typeof ButtonGroupSize];

const type_config: Record<ButtonGroupType, (s: Style) => Style> = {
    [ButtonGroupType.STANDARD]: (s) => {
        return s;
    },
    [ButtonGroupType.CONNECTED]: (s) => {
        return s
            .first((s) => {
                s.css({
                    borderTopLeftRadius: "28px",
                    borderBottomLeftRadius: "28px",
                });
            })
            .last((s) => {
                s.css({
                    borderTopRightRadius: "28px",
                    borderBottomRightRadius: "28px",
                });
            });
    },
};

const size_config: Record<ButtonGroupSize, (s: Style) => Style> = {
    [ButtonGroupSize.EXTRA_SMALL]: (s) => {
        return s.gap(16);
    },
    [ButtonGroupSize.SMALL]: (s) => {
        return s.gap(12);
    },
    [ButtonGroupSize.MEDIUM]: (s) => {
        return s.gap(8);
    },
    [ButtonGroupSize.LARGE]: (s) => {
        return s.gap(8);
    },
    [ButtonGroupSize.EXTRA_LARGE]: (s) => {
        return s.gap(8);
    },
};

const gbtn = new Style(".gbtn")
    .withTheme(darkTheme)
    // @theme-start
    .themeRadius("sm")
    // @theme-end
    .display("flex")
    .gap(2);

Object.entries(type_config).forEach(([type, applyFn]) => {
    applyFn(
        new Style(`.gbtn[data-type="${type}"] button`).withTheme(darkTheme),
    ).apply();
});

Object.entries(size_config).forEach(([size, applyFn]) => {
    applyFn(
        new Style(`.gbtn[data-type=standard][data-size="${size}"]`).withTheme(
            darkTheme,
        ),
    ).apply();
});

gbtn.apply();
