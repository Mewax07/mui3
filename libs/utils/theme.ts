export interface ThemeColors {
    primary: string;
    on_primary: string;
    primary_container: string;
    on_primary_container: string;

    secondary: string;
    on_secondary: string;
    secondary_container: string;
    on_secondary_container: string;

    tertiary: string;
    on_tertiary: string;
    tertiary_container: string;
    on_tertiary_container: string;

    error: string;
    on_error: string;
    error_container: string;
    on_error_container: string;

    surface: string;
    on_surface: string;
    surface_variant: string;
    on_surface_variant: string;
    inverse_surface: string;
    on_inverse_surface: string;
    surface_container_lowest: string;
    on_surface_container_lowest: string;
    surface_container_high: string;
    on_surface_container_high: string;
    surface_container: string;

    outline: string;
    outline_variant: string;

    background: string;
    on_background: string;
}

export interface ThemeSpacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    [key: string]: number;
}

export interface ThemeTypography {
    fontFamily: {
        base: string;
        heading: string;
        mono: string;
    };
    fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        "2xl": string;
        "3xl": string;
        "4xl": string;
        [key: string]: string;
    };
    fontWeight: {
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
        [key: string]: number;
    };
    lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
        loose: number;
        [key: string]: number;
    };
}

export interface ThemeBorderRadius {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    lg_inc: number;
    xl: number;
    xl_inc: number;
    xxl: number;
    full: number;
    [key: string]: number;
}

export interface ThemeShadows {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    inner: string;
    [key: string]: string;
}

export interface ThemeBreakpoints {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
    [key: string]: number;
}

export interface ThemeTransitions {
    duration: {
        fast: string;
        normal: string;
        slow: string;
        [key: string]: string;
    };
    timing: {
        linear: string;
        ease: string;
        easeIn: string;
        easeOut: string;
        easeInOut: string;
        [key: string]: string;
    };
}

export interface ThemeZIndex {
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
    [key: string]: number;
}

export interface Theme {
    colors: ThemeColors;
    spacing: ThemeSpacing;
    typography: ThemeTypography;
    borderRadius: ThemeBorderRadius;
    shadows: ThemeShadows;
    breakpoints: ThemeBreakpoints;
    transitions: ThemeTransitions;
    zIndex: ThemeZIndex;
    custom?: Record<string, any>;
}

export class ThemeManager {
    private theme: Theme;
    private static instance: ThemeManager | null = null;

    constructor(theme?: Partial<Theme>) {
        this.theme = this.mergeWithDefaults(theme || {});
    }

    private getDefaultTheme(): Theme {
        return {
            colors: {
                primary: "#CCBEFF",
                on_primary: "#340C8F",
                primary_container: "#4B2EA6",
                on_primary_container: "#E7DEFF",

                secondary: "#CAC3DC",
                on_secondary: "#322E41",
                secondary_container: "#494458",
                on_secondary_container: "#E7DFF8",

                tertiary: "#EEB8CB",
                on_tertiary: "#492534",
                tertiary_container: "#623B4A",
                on_tertiary_container: "#FFD9E5",

                error: "#FFB4AB",
                on_error: "#690005",
                error_container: "#93000A",
                on_error_container: "#FFB4AB",

                surface: "#1C1B1E",
                on_surface: "#E6E1E6",
                surface_variant: "#48454E",
                on_surface_variant: "#CAC4CF",

                inverse_surface: "#E6E1E6",
                on_inverse_surface: "#313033",

                surface_container_lowest: "#0F0E11",
                on_surface_container_lowest: "#E6E1E6",

                surface_container_high: "#2B292D",
                on_surface_container_high: "#E6E1E6",

                surface_container: "#201F23",

                outline: "#938F99",
                outline_variant: "#48454E",

                background: "#1C1B1E",
                on_background: "#E6E1E6",
            },
            spacing: {
                xs: 4,
                sm: 8,
                md: 16,
                lg: 24,
                xl: 32,
                xxl: 48,
            },
            typography: {
                fontFamily: {
                    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    heading: "inherit",
                    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                },
                fontSize: {
                    xs: "0.75rem", // 12px
                    sm: "0.875rem", // 14px
                    base: "1rem", // 16px
                    lg: "1.125rem", // 18px
                    xl: "1.25rem", // 20px
                    "2xl": "1.5rem", // 24px
                    "3xl": "1.875rem", // 30px
                    "4xl": "2.25rem", // 36px
                },
                fontWeight: {
                    light: 300,
                    normal: 400,
                    medium: 500,
                    semibold: 600,
                    bold: 700,
                },
                lineHeight: {
                    tight: 1.25,
                    normal: 1.5,
                    relaxed: 1.75,
                    loose: 2,
                },
            },
            borderRadius: {
                none: 0,
                xs: 4,
                sm: 8,
                md: 12,
                lg: 16,
                lg_inc: 20,
                xl: 28,
                xl_inc: 32,
                xxl: 48,
                full: 9999,
            },
            shadows: {
                none: "none",
                sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            },
            breakpoints: {
                xs: 0,
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1280,
                "2xl": 1536,
            },
            transitions: {
                duration: {
                    fast: "150ms",
                    normal: "300ms",
                    slow: "500ms",
                },
                timing: {
                    linear: "linear",
                    ease: "ease",
                    easeIn: "ease-in",
                    easeOut: "ease-out",
                    easeInOut: "ease-in-out",
                },
            },
            zIndex: {
                dropdown: 1000,
                sticky: 1020,
                fixed: 1030,
                modal: 1040,
                popover: 1050,
                tooltip: 1060,
            },
        };
    }

    private mergeWithDefaults(customTheme: Partial<Theme>): Theme {
        const defaultTheme = this.getDefaultTheme();

        return {
            colors: { ...defaultTheme.colors, ...customTheme.colors },
            spacing: { ...defaultTheme.spacing, ...customTheme.spacing },
            typography: {
                fontFamily: {
                    ...defaultTheme.typography.fontFamily,
                    ...customTheme.typography?.fontFamily,
                },
                fontSize: {
                    ...defaultTheme.typography.fontSize,
                    ...customTheme.typography?.fontSize,
                },
                fontWeight: {
                    ...defaultTheme.typography.fontWeight,
                    ...customTheme.typography?.fontWeight,
                },
                lineHeight: {
                    ...defaultTheme.typography.lineHeight,
                    ...customTheme.typography?.lineHeight,
                },
            },
            borderRadius: {
                ...defaultTheme.borderRadius,
                ...customTheme.borderRadius,
            },
            shadows: { ...defaultTheme.shadows, ...customTheme.shadows },
            breakpoints: {
                ...defaultTheme.breakpoints,
                ...customTheme.breakpoints,
            },
            transitions: {
                duration: {
                    ...defaultTheme.transitions.duration,
                    ...customTheme.transitions?.duration,
                },
                timing: {
                    ...defaultTheme.transitions.timing,
                    ...customTheme.transitions?.timing,
                },
            },
            zIndex: { ...defaultTheme.zIndex, ...customTheme.zIndex },
            custom: customTheme.custom || {},
        };
    }
    color(key: string): string {
        const keys = key.split(".");
        let value: any = this.theme.colors;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Color "${key}" not found in theme`);
                return key;
            }
        }

        return value;
    }

    get colors(): ThemeColors {
        return this.theme.colors;
    }
    space(key: keyof ThemeSpacing | number): number {
        if (typeof key === "number") return key;
        return this.theme.spacing[key] ?? key;
    }

    get spacing(): ThemeSpacing {
        return this.theme.spacing;
    }
    fontSize(key: keyof ThemeTypography["fontSize"]): string {
        return this.theme.typography.fontSize[key] ?? key;
    }

    fontWeight(key: keyof ThemeTypography["fontWeight"]): number {
        return this.theme.typography.fontWeight[key] ?? key;
    }

    fontFamily(key: keyof ThemeTypography["fontFamily"]): string {
        return this.theme.typography.fontFamily[key] ?? key;
    }

    lineHeight(key: keyof ThemeTypography["lineHeight"]): number {
        return this.theme.typography.lineHeight[key] ?? key;
    }

    get typography(): ThemeTypography {
        return this.theme.typography;
    }
    radius(key: keyof ThemeBorderRadius): number {
        return this.theme.borderRadius[key] ?? key;
    }

    get borderRadius(): ThemeBorderRadius {
        return this.theme.borderRadius;
    }
    shadow(key: keyof ThemeShadows): string {
        return this.theme.shadows[key] ?? key;
    }

    get shadows(): ThemeShadows {
        return this.theme.shadows;
    }
    breakpoint(key: keyof ThemeBreakpoints): number {
        return this.theme.breakpoints[key] ?? key;
    }

    get breakpoints(): ThemeBreakpoints {
        return this.theme.breakpoints;
    }
    duration(key: keyof ThemeTransitions["duration"]): string {
        return this.theme.transitions.duration[key] ?? key;
    }

    timing(key: keyof ThemeTransitions["timing"]): string {
        return this.theme.transitions.timing[key] ?? key;
    }

    transition(
        property: string = "all",
        durationKey: keyof ThemeTransitions["duration"] = "normal",
        timingKey: keyof ThemeTransitions["timing"] = "ease",
    ): string {
        return `${property} ${this.duration(durationKey)} ${this.timing(timingKey)}`;
    }

    get transitions(): ThemeTransitions {
        return this.theme.transitions;
    }
    z(key: keyof ThemeZIndex): number {
        return this.theme.zIndex[key] ?? key;
    }

    get zIndex(): ThemeZIndex {
        return this.theme.zIndex;
    }
    custom<T = any>(key: string): T | undefined {
        return this.theme.custom?.[key];
    }
    setColor(key: string, value: string): this {
        const keys = key.split(".");
        let target: any = this.theme.colors;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!target[keys[i]]) {
                target[keys[i]] = {};
            }
            target = target[keys[i]];
        }

        target[keys[keys.length - 1]] = value;
        return this;
    }
    setSpacing(key: string, value: number): this {
        this.theme.spacing[key] = value;
        return this;
    }

    setCustom(key: string, value: any): this {
        if (!this.theme.custom) {
            this.theme.custom = {};
        }
        this.theme.custom[key] = value;
        return this;
    }
    updateTheme(updates: Partial<Theme>): this {
        this.theme = this.mergeWithDefaults({ ...this.theme, ...updates });
        return this;
    }

    getTheme(): Theme {
        return this.theme;
    }
    static createGlobal(theme?: Partial<Theme>): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager(theme);
        }
        return ThemeManager.instance;
    }

    static getGlobal(): ThemeManager | null {
        return ThemeManager.instance;
    }

    static resetGlobal(): void {
        ThemeManager.instance = null;
    }
    lighten(color: string, amount: number = 0.1): string {
        return this.adjustColor(color, amount);
    }

    darken(color: string, amount: number = 0.1): string {
        return this.adjustColor(color, -amount);
    }

    alpha(color: string, opacity: number): string {
        if (color.startsWith("#")) {
            const hex = color.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    }

    private adjustColor(color: string, amount: number): string {
        if (color.startsWith("#")) {
            const hex = color.replace("#", "");
            const num = parseInt(hex, 16);
            const r = Math.min(255, Math.max(0, (num >> 16) + amount * 255));
            const g = Math.min(
                255,
                Math.max(0, ((num >> 8) & 0x00ff) + amount * 255),
            );
            const b = Math.min(
                255,
                Math.max(0, (num & 0x0000ff) + amount * 255),
            );
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        }
        return color;
    }
    exportTheme(): string {
        return JSON.stringify(this.theme, null, 2);
    }

    importTheme(jsonTheme: string): this {
        try {
            const theme = JSON.parse(jsonTheme);
            this.theme = this.mergeWithDefaults(theme);
        } catch (e) {
            console.error("Failed to import theme:", e);
        }
        return this;
    }
    generateCSSVariables(): string {
        let css = ":root {\n";

        // Colors
        const flattenColors = (obj: any, prefix = "color"): string => {
            let result = "";
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === "string") {
                    result += `  --${prefix}-${key}: ${value};\n`;
                } else if (typeof value === "object") {
                    result += flattenColors(value, `${prefix}-${key}`);
                }
            }
            return result;
        };

        css += flattenColors(this.theme.colors);

        // Spacing
        for (const [key, value] of Object.entries(this.theme.spacing)) {
            css += `  --space-${key}: ${value}px;\n`;
        }

        // Shadows
        for (const [key, value] of Object.entries(this.theme.shadows)) {
            css += `  --shadow-${key}: ${value};\n`;
        }

        // Border radius
        for (const [key, value] of Object.entries(this.theme.borderRadius)) {
            css += `  --radius-${key}: ${value}px;\n`;
        }

        css += "}\n";
        return css;
    }

    applyCSSVariables(): this {
        const style = document.createElement("style");
        style.setAttribute("data-theme-variables", "true");
        style.textContent = this.generateCSSVariables();
        document.head.appendChild(style);
        return this;
    }
}

export const lightThemeColors: ThemeColors = {
    primary: "#6349BF",
    on_primary: "#FFFFFF",
    primary_container: "#E7DEFF",
    on_primary_container: "#1E0060",

    secondary: "#615B71",
    on_secondary: "#FFFFFF",
    secondary_container: "#E7DFF8",
    on_secondary_container: "#1D192B",

    tertiary: "#7D5262",
    on_tertiary: "#FFFFFF",
    tertiary_container: "#FFD9E5",
    on_tertiary_container: "#31111F",

    error: "#BA1A1A",
    on_error: "#FFFFFF",
    error_container: "#FFDAD6",
    on_error_container: "#410002",

    surface: "#FFFBFF",
    on_surface: "#1C1B1E",
    surface_variant: "#E6E0EC",
    on_surface_variant: "#48454E",

    inverse_surface: "#313033",
    on_inverse_surface: "#F4EFF4",

    surface_container_lowest: "#FFFFFF",
    on_surface_container_lowest: "#1C1B1E",

    surface_container_high: "#EBE7EB",
    on_surface_container_high: "#1C1B1E",

    surface_container: "#F1ECF1",

    outline: "#79757F",
    outline_variant: "#CAC4CF",

    background: "#FFFBFF",
    on_background: "#1C1B1E",
};

export const darkThemeColors: ThemeColors = {
    primary: "#CCBEFF",
    on_primary: "#340C8F",
    primary_container: "#4B2EA6",
    on_primary_container: "#E7DEFF",

    secondary: "#CAC3DC",
    on_secondary: "#322E41",
    secondary_container: "#494458",
    on_secondary_container: "#E7DFF8",

    tertiary: "#EEB8CB",
    on_tertiary: "#492534",
    tertiary_container: "#623B4A",
    on_tertiary_container: "#FFD9E5",

    error: "#FFB4AB",
    on_error: "#690005",
    error_container: "#93000A",
    on_error_container: "#FFB4AB",

    surface: "#1C1B1E",
    on_surface: "#E6E1E6",
    surface_variant: "#48454E",
    on_surface_variant: "#CAC4CF",

    inverse_surface: "#E6E1E6",
    on_inverse_surface: "#313033",

    surface_container_lowest: "#0F0E11",
    on_surface_container_lowest: "#E6E1E6",

    surface_container_high: "#2B292D",
    on_surface_container_high: "#E6E1E6",

    surface_container: "#201F23",

    outline: "#938F99",
    outline_variant: "#48454E",

    background: "#1C1B1E",
    on_background: "#E6E1E6",
};

export const lightTheme = new ThemeManager({
    colors: lightThemeColors,
});

export const darkTheme = new ThemeManager({
    colors: darkThemeColors,
});
