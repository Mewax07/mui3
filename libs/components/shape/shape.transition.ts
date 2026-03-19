import { ShapeType } from "./shape.style";
import { shape_data, shapeWidth, shapeHeight } from "./shape.data";
import { Html } from "../../utils";

export type EasingName =
    | "linear"
    | "easeIn"
    | "easeOut"
    | "easeInOut"
    | "bounce"
    | "elastic"
    | "back";

export type EasingFn = (t: number) => number;

export const EASINGS: Record<EasingName, EasingFn> = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    bounce: (t) => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) {
            t -= 1.5 / 2.75;
            return 7.5625 * t * t + 0.75;
        }
        if (t < 2.5 / 2.75) {
            t -= 2.25 / 2.75;
            return 7.5625 * t * t + 0.9375;
        }
        t -= 2.625 / 2.75;
        return 7.5625 * t * t + 0.984375;
    },
    elastic: (t) => {
        if (t === 0 || t === 1) return t;
        return (
            Math.pow(2, -10 * t) *
                Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) +
            1
        );
    },
    back: (t) => {
        const c1 = 1.70158;
        return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
};

type Point = [number, number];

function cubicAt(
    p0: number,
    p1: number,
    p2: number,
    p3: number,
    t: number,
): number {
    const mt = 1 - t;
    return (
        mt * mt * mt * p0 +
        3 * mt * mt * t * p1 +
        3 * mt * t * t * p2 +
        t * t * t * p3
    );
}

function quadAt(p0: number, p1: number, p2: number, t: number): number {
    const mt = 1 - t;
    return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

const STEPS = 6;

function pathToPolyline(raw: string, scaleX: number, scaleY: number): Point[] {
    const d = raw
        .replace(/-?\d*\.?\d+e[-+]?\d+/gi, "0")
        .replace(/\s+/g, " ")
        .trim();
    const tokens =
        d.match(/[MmLlHhVvCcSsQqTtAaZz]|[-+]?[0-9]*\.?[0-9]+/g) ?? [];

    const pts: Point[] = [];
    let cx = 0,
        cy = 0,
        sx = 0,
        sy = 0;
    let lctx = 0,
        lcty = 0;
    let i = 0;

    const n = () => parseFloat(tokens[i++]);
    const put = (x: number, y: number) => pts.push([x * scaleX, y * scaleY]);

    const cubic = (
        x1: number,
        y1: number,
        cx1: number,
        cy1: number,
        cx2: number,
        cy2: number,
        x2: number,
        y2: number,
    ) => {
        for (let s = 1; s <= STEPS; s++) {
            const t = s / STEPS;
            put(cubicAt(x1, cx1, cx2, x2, t), cubicAt(y1, cy1, cy2, y2, t));
        }
    };

    const quad = (
        x1: number,
        y1: number,
        qx: number,
        qy: number,
        x2: number,
        y2: number,
    ) => {
        for (let s = 1; s <= STEPS; s++) {
            const t = s / STEPS;
            put(quadAt(x1, qx, x2, t), quadAt(y1, qy, y2, t));
        }
    };

    while (i < tokens.length) {
        const tok = tokens[i];
        const isCmd = /[A-Za-z]/.test(tok);
        const c = isCmd ? tokens[i++] : tok;

        switch (c) {
            case "M":
                cx = n();
                cy = n();
                sx = cx;
                sy = cy;
                put(cx, cy);
                break;
            case "m":
                cx += n();
                cy += n();
                sx = cx;
                sy = cy;
                put(cx, cy);
                break;
            case "L":
                cx = n();
                cy = n();
                put(cx, cy);
                break;
            case "l":
                cx += n();
                cy += n();
                put(cx, cy);
                break;
            case "H":
                cx = n();
                put(cx, cy);
                break;
            case "h":
                cx += n();
                put(cx, cy);
                break;
            case "V":
                cy = n();
                put(cx, cy);
                break;
            case "v":
                cy += n();
                put(cx, cy);
                break;
            case "C": {
                const x1 = cx,
                    y1 = cy,
                    cx1 = n(),
                    cy1 = n(),
                    cx2 = n(),
                    cy2 = n(),
                    x2 = n(),
                    y2 = n();
                cubic(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
                lctx = cx2;
                lcty = cy2;
                cx = x2;
                cy = y2;
                break;
            }
            case "c": {
                const x1 = cx,
                    y1 = cy,
                    cx1 = cx + n(),
                    cy1 = cy + n(),
                    cx2 = cx + n(),
                    cy2 = cy + n(),
                    x2 = cx + n(),
                    y2 = cy + n();
                cubic(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
                lctx = cx2;
                lcty = cy2;
                cx = x2;
                cy = y2;
                break;
            }
            case "S": {
                const rx = 2 * cx - lctx,
                    ry = 2 * cy - lcty,
                    cx2 = n(),
                    cy2 = n(),
                    x2 = n(),
                    y2 = n();
                cubic(cx, cy, rx, ry, cx2, cy2, x2, y2);
                lctx = cx2;
                lcty = cy2;
                cx = x2;
                cy = y2;
                break;
            }
            case "s": {
                const rx = 2 * cx - lctx,
                    ry = 2 * cy - lcty,
                    cx2 = cx + n(),
                    cy2 = cy + n(),
                    x2 = cx + n(),
                    y2 = cy + n();
                cubic(cx, cy, rx, ry, cx2, cy2, x2, y2);
                lctx = cx2;
                lcty = cy2;
                cx = x2;
                cy = y2;
                break;
            }
            case "Q": {
                const x1 = cx,
                    y1 = cy,
                    qx = n(),
                    qy = n(),
                    x2 = n(),
                    y2 = n();
                quad(x1, y1, qx, qy, x2, y2);
                lctx = qx;
                lcty = qy;
                cx = x2;
                cy = y2;
                break;
            }
            case "q": {
                const x1 = cx,
                    y1 = cy,
                    qx = cx + n(),
                    qy = cy + n(),
                    x2 = cx + n(),
                    y2 = cy + n();
                quad(x1, y1, qx, qy, x2, y2);
                lctx = qx;
                lcty = qy;
                cx = x2;
                cy = y2;
                break;
            }
            case "T": {
                const qx = 2 * cx - lctx,
                    qy = 2 * cy - lcty,
                    x2 = n(),
                    y2 = n();
                quad(cx, cy, qx, qy, x2, y2);
                lctx = qx;
                lcty = qy;
                cx = x2;
                cy = y2;
                break;
            }
            case "t": {
                const qx = 2 * cx - lctx,
                    qy = 2 * cy - lcty,
                    x2 = cx + n(),
                    y2 = cy + n();
                quad(cx, cy, qx, qy, x2, y2);
                lctx = qx;
                lcty = qy;
                cx = x2;
                cy = y2;
                break;
            }
            case "A":
            case "a": {
                n();
                n();
                n();
                n();
                n();
                const ex = c === "a" ? cx + n() : n();
                const ey = c === "a" ? cy + n() : n();
                for (let s = 1; s <= STEPS; s++) {
                    const t = s / STEPS;
                    put(cx + (ex - cx) * t, cy + (ey - cy) * t);
                }
                cx = ex;
                cy = ey;
                break;
            }
            case "Z":
            case "z":
                put(sx, sy);
                cx = sx;
                cy = sy;
                break;
            default:
                break;
        }
    }

    return pts;
}

function resample(pts: Point[], n: number): Point[] {
    if (pts.length === 0)
        return Array.from({ length: n }, () => [0, 0] as Point);
    if (pts.length === 1)
        return Array.from({ length: n }, () => [...pts[0]] as Point);

    const lens: number[] = [0];
    for (let k = 1; k < pts.length; k++) {
        const dx = pts[k][0] - pts[k - 1][0];
        const dy = pts[k][1] - pts[k - 1][1];
        lens.push(lens[k - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    const total = lens[lens.length - 1];

    const out: Point[] = [];
    let seg = 0;

    for (let k = 0; k < n; k++) {
        const target = (k / (n - 1)) * total;
        while (seg < lens.length - 2 && lens[seg + 1] < target) seg++;
        const span = lens[seg + 1] - lens[seg];
        const t = span < 1e-10 ? 0 : (target - lens[seg]) / span;
        out.push([
            pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * t,
            pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * t,
        ]);
    }

    return out;
}

const MORPH_N = 128;

function buildInterpolator(
    from: ShapeType,
    to: ShapeType,
): (t: number) => string {
    const fd = shape_data[from],
        fw = shapeWidth(from),
        fh = shapeHeight(from);
    const td = shape_data[to],
        tw = shapeWidth(to),
        th = shapeHeight(to);

    const fPts = resample(
        pathToPolyline(fd.path, fw / fd.vbW, fh / fd.vbH),
        MORPH_N,
    );
    const tPts = resample(
        pathToPolyline(td.path, tw / td.vbW, th / td.vbH),
        MORPH_N,
    );

    return (t: number): string => {
        const parts: string[] = [
            `M${(fPts[0][0] + (tPts[0][0] - fPts[0][0]) * t).toFixed(2)} ${(fPts[0][1] + (tPts[0][1] - fPts[0][1]) * t).toFixed(2)}`,
        ];
        for (let k = 1; k < MORPH_N; k++) {
            parts.push(
                `L${(fPts[k][0] + (tPts[k][0] - fPts[k][0]) * t).toFixed(2)} ${(fPts[k][1] + (tPts[k][1] - fPts[k][1]) * t).toFixed(2)}`,
            );
        }
        parts.push("Z");
        return `path("${parts.join("")}")`;
    };
}

export interface TransitionOptions {
    duration?: number;
    easing?: EasingName | EasingFn;
    onComplete?: () => void;
}

export class ShapeTransition {
    private _rafId: number | null = null;

    morph(
        el: Html,
        from: ShapeType,
        to: ShapeType,
        options: TransitionOptions = {},
    ): Promise<void> {
        const { duration = 0.4, easing = "easeInOut", onComplete } = options;
        const easingFn: EasingFn =
            typeof easing === "function" ? easing : EASINGS[easing];

        const interpolate = buildInterpolator(from, to);
        this.cancel();

        const ms = duration * 1000;
        const start = performance.now();

        return new Promise((resolve) => {
            const tick = (now: number) => {
                const raw = Math.min((now - start) / ms, 1);
                el.elm.style.clipPath = interpolate(
                    Math.max(0, Math.min(1, easingFn(raw))),
                );

                if (raw < 1) {
                    this._rafId = requestAnimationFrame(tick);
                } else {
                    this._rafId = null;
                    onComplete?.();
                    resolve();
                }
            };
            this._rafId = requestAnimationFrame(tick);
        });
    }

    cancel(): void {
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
    }
}
