import { darkTheme, Style } from "../../utils";

function factorTable(n_r1_c1: number, n_r1_c2: number, n_r2_c1: number) {
    return (n_r1_c2 * n_r2_c1) / n_r1_c1;
}

type ScaleOptions = {
    width: number;
    height: number;
    viewBoxWidth: number;
    viewBoxHeight: number;
};

export function svgPathToClipPath(path: string, opts: ScaleOptions) {
    const { width, height, viewBoxWidth, viewBoxHeight } = opts;

    const scaleX = width / viewBoxWidth;
    const scaleY = height / viewBoxHeight;

    let i = 0;

    return path.replace(/-?\d*\.?\d+(e[-+]?\d+)?/gi, (num) => {
        const n = parseFloat(num);
        i++;
        const scaled = i % 2 === 1 ? n * scaleX : n * scaleY;
        return Number.isFinite(scaled) ? scaled.toFixed(2) : "0";
    });
}

export function cleanSvgPath(path: string) {
    return path
        .replace(/-?\d*\.?\d+e[-+]?\d+/gi, "0")
        .replace(/\s+/g, " ")
        .trim();
}

export enum ShapeType {
    CIRCLE = "circle",
    SQUARE = "square",
    SLANTED = "slanted",
    ARCH = "arch",
    SEMICICLE = "semicircle",
    OVAL = "oval",
    PIL = "pil",
    TRIANGLE = "triangle",
    ARROW = "arrow",
    FAN = "fan",
}

const type_config: Record<ShapeType, (s: Style) => Style> = {
    [ShapeType.CIRCLE]: (s) => {
        const basePath = cleanSvgPath(
            `M320 160C320 248.366 248.366 320 160 320C71.6344 320 -7.72516e-06 248.366 0 160C7.72517e-06 71.6344 71.6345 -7.72516e-06 160 0C248.366 7.72516e-06 320 71.6345 320 160Z`,
        );

        const width = factorTable(380, 320, 80);
        const height = factorTable(380, 320, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 320,
            viewBoxHeight: 320,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.SQUARE]: (s) => {
        const basePath = cleanSvgPath(
            `M320 172C320 216.717 320 239.076 312.978 256.812C302.813 282.485 282.485 302.813 256.812 312.978C239.076 320 216.717 320 172 320H148C103.283 320 80.924 320 63.1875 312.978C37.5145 302.813 17.187 282.485 7.02234 256.812C-5.72205e-06 239.076 -3.90348e-06 216.717 5.83532e-09 172L2.10398e-06 148C6.0133e-06 103.283 8.10623e-06 80.924 7.02236 63.1875C17.187 37.5145 37.5146 17.187 63.1876 7.02234C80.924 -5.72205e-06 103.283 -3.90348e-06 148 5.82986e-09L172 2.10397e-06C216.717 6.01329e-06 239.076 8.10623e-06 256.812 7.02236C282.485 17.187 302.813 37.5146 312.978 63.1876C320 80.924 320 103.283 320 148V172Z`,
        );

        const width = factorTable(380, 320, 80);
        const height = factorTable(380, 320, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 320,
            viewBoxHeight: 320,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.SLANTED]: (s) => {
        const basePath = cleanSvgPath(
            `M15.7147 80.543C18.289 55.9642 19.5761 43.6748 24.3025 33.9777C31.142 19.9453 43.0768 9.11012 57.6278 3.72286C67.6833 0 79.9328 0 104.432 0H228.137C257.764 0 272.578 0 283.887 4.85392C300.261 11.8819 312.72 25.8495 317.927 43.0153C321.523 54.8709 319.967 69.733 316.854 99.457L304.285 219.457C301.711 244.036 300.424 256.325 295.697 266.022C288.858 280.055 276.923 290.89 262.372 296.277C252.317 300 240.067 300 215.568 300H91.8634C62.2359 300 47.4221 300 36.1134 295.146C19.7395 288.118 7.2802 274.151 2.07293 256.985C-1.5235 245.129 0.0330968 230.267 3.14629 200.543L15.7147 80.543Z`,
        );

        const width = factorTable(380, 320, 80);
        const height = factorTable(380, 300, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 320,
            viewBoxHeight: 300,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.ARCH]: (s) => {
        const basePath = cleanSvgPath(
            `M310 258.727C310 264.96 310 268.076 309.689 270.696C307.259 291.14 291.14 307.259 270.696 309.689C268.076 310 264.96 310 258.727 310H51.2732C45.0405 310 41.9242 310 39.3043 309.689C18.8596 307.259 2.74071 291.14 0.311326 270.696C9.86457e-06 268.076 9.61297e-06 264.96 9.06809e-06 258.727L0 155C-7.48375e-06 69.3959 69.3958 7.48375e-06 155 0C240.604 -7.48375e-06 310 69.3958 310 155V258.727Z`,
        );

        const width = factorTable(380, 310, 80);
        const height = factorTable(380, 310, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 310,
            viewBoxHeight: 310,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.SEMICICLE]: (s) => {
        const basePath = cleanSvgPath(
            `M320 166.921C320 185.19 305.19 200 286.921 200L33.0794 200C14.8102 200 2.20218e-06 185.19 6.05025e-07 166.921L0 160C-7.72516e-06 71.6345 71.6344 7.72516e-06 160 0C248.366 -7.72516e-06 320 71.6344 320 160V166.921Z`,
        );

        const width = factorTable(380, 320, 80);
        const height = factorTable(380, 200, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 320,
            viewBoxHeight: 200,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.OVAL]: (s) => {
        const basePath = cleanSvgPath(
            `M231.309 231.309C161.705 300.913 68.8765 320.935 23.9707 276.029C-20.9352 231.123 -0.913343 138.295 68.6908 68.6908C138.295 -0.913329 231.123 -20.9352 276.029 23.9707C320.935 68.8765 300.913 161.705 231.309 231.309Z`,
        );

        const width = factorTable(380, 300, 80);
        const height = factorTable(380, 300, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 300,
            viewBoxHeight: 300,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.PIL]: (s) => {
        const basePath = cleanSvgPath(
            `M84.1157 39.7851C137.162 -13.2617 223.168 -13.2617 276.215 39.7851C329.262 92.8318 329.262 178.838 276.215 231.884L231.884 276.215C178.838 329.262 92.8318 329.262 39.7851 276.215C-13.2617 223.168 -13.2617 137.162 39.7851 84.1157L84.1157 39.7851Z`,
        );

        const width = factorTable(380, 316, 80);
        const height = factorTable(380, 316, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 316,
            viewBoxHeight: 316,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.TRIANGLE]: (s) => {
        const basePath = cleanSvgPath(
            `M104.461 51.2021C119.597 24.8217 127.165 11.6315 136.342 6.05941C149.648 -2.0198 166.352 -2.0198 179.658 6.05941C188.835 11.6315 196.403 24.8217 211.539 51.2021L293.309 193.72C308.3 219.847 315.795 232.911 315.993 243.585C316.28 259.06 307.949 273.418 294.364 280.864C284.994 286 269.919 286 239.77 286H76.2298C46.0806 286 31.006 286 21.636 280.864C8.05049 273.418 -0.279556 259.06 0.00717127 243.585C0.204929 232.911 7.70026 219.847 22.6909 193.72L104.461 51.2021Z`,
        );

        const width = factorTable(380, 316, 80);
        const height = factorTable(380, 286, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 316,
            viewBoxHeight: 286,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.ARROW]: (s) => {
        const basePath = cleanSvgPath(
            `M232.422 59.9068C223.213 45.2936 213.84 30.4777 201.389 18.8739C188.938 7.24119 172.808 -0.97696 156.27 0.0937147C141.748 1.04864 128.288 9.09317 117.662 19.5974C107.036 30.1015 98.7807 43.0365 90.6614 55.8556C68.7011 90.4645 46.7136 125.073 24.7533 159.711C14.3181 176.147 3.61045 193.307 0.722376 212.898C-2.76511 236.568 6.63475 260.673 23.3093 276.415C40.7467 292.88 69.0008 291.549 90.2254 287.035C113.493 282.086 136.244 272.769 159.975 272.797C180.301 272.797 199.945 279.685 219.726 284.691C239.479 289.668 260.704 292.735 279.776 285.327C303.453 276.154 320.454 250.082 319.991 223.315C319.555 198.892 293.508 156.759 293.508 156.759C293.508 156.759 252.78 92.1937 232.422 59.9068Z`,
        );

        const width = factorTable(380, 320, 80);
        const height = factorTable(380, 290, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 320,
            viewBoxHeight: 290,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
    [ShapeType.FAN]: (s) => {
        const basePath = cleanSvgPath(
            `M0 47.3684C0 45.697 0 44.8613 0.0219308 44.1547C0.768592 20.0969 20.0969 0.768592 44.1547 0.0219308C44.8613 0 45.697 0 47.3684 0C56.2825 0 60.7395 0 64.5082 0.116964C192.816 4.09916 295.901 107.184 299.883 235.492C300 239.26 300 243.717 300 252.632C300 254.303 300 255.139 299.978 255.845C299.231 279.903 279.903 299.231 255.845 299.978C255.139 300 254.303 300 252.632 300H67.4411C47.0642 300 36.8757 300 28.7935 296.8C17.0947 292.168 7.83183 282.905 3.19997 271.207C0 263.124 0 252.936 0 232.559V47.3684Z`,
        );

        const width = factorTable(380, 300, 80);
        const height = factorTable(380, 300, 80);

        const scaledPath = svgPathToClipPath(basePath, {
            width,
            height,
            viewBoxWidth: 300,
            viewBoxHeight: 300,
        });

        return s
            .css({
                clipPath: `path("${scaledPath}")`,
            })
            .w(width)
            .h(height);
    },
};

const shape = new Style(".shape")
    .withTheme(darkTheme)
    .child(" > div", (s) => {
        // @theme-start
        return s.themeBgColor("primary").themeColor("on_primary");
        // @theme-end
    })
    // @var-start
    .w(80)
    .h(80)
    // @var-end
    .border(1, "solid", "red")
    .display("flex")
    .alignItems("center")
    .justifyContent("center");

Object.entries(type_config).forEach(([type, applyFn]) => {
    applyFn(
        new Style(`.shape[data-shape="${type}"] > div`).withTheme(darkTheme),
    ).apply();
});

shape.apply();
