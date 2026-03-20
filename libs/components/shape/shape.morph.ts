// flubber : <script src="https://cdn.jsdelivr.net/npm/flubber@0.4.2/build/flubber.min.js"></script>

declare const flubber: {
    interpolate: (
        a: string,
        b: string,
        opts?: { maxSegmentLength?: number },
    ) => (t: number) => string;
};

export type EasingName =
    | "linear"
    | "easeInOut"
    | "easeIn"
    | "easeOut"
    | "bounce"
    | "elastic";

export const EASINGS: Record<EasingName, (t: number) => number> = {
    linear: (t) => t,
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
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
};

export interface MorphOptions {
    duration?: number;
    easing?: EasingName;
    maxSegmentLength?: number;
    onProgress?: (t: number) => void;
    onComplete?: () => void;
}

export class ShapeMorpher {
    private animId: number | null = null;
    private currentPath: string = "";

    constructor(private readonly svgPath: SVGPathElement) {}

    getCurrent(): string {
        return this.currentPath || this.svgPath.getAttribute("d") || "";
    }

    morph(
        fromPath: string,
        toPath: string,
        options: MorphOptions = {},
    ): Promise<void> {
        const {
            duration = 600,
            easing = "easeInOut",
            maxSegmentLength = 4,
            onProgress,
            onComplete,
        } = options;

        this.cancel();

        return new Promise((resolve) => {
            let interp: (t: number) => string;

            try {
                interp = flubber.interpolate(fromPath, toPath, {
                    maxSegmentLength,
                });
            } catch {
                this.svgPath.setAttribute("d", toPath);
                this.currentPath = toPath;
                onComplete?.();
                resolve();
                return;
            }

            const ease = EASINGS[easing] ?? EASINGS.linear;
            const start = performance.now();

            const frame = (now: number) => {
                const t = Math.min((now - start) / duration, 1);
                const et = Math.max(0, Math.min(1, ease(t)));

                this.svgPath.setAttribute("d", interp(et));
                onProgress?.(t);

                if (t < 1) {
                    this.animId = requestAnimationFrame(frame);
                } else {
                    this.currentPath = toPath;
                    this.svgPath.setAttribute("d", toPath);
                    this.animId = null;
                    onComplete?.();
                    resolve();
                }
            };

            this.animId = requestAnimationFrame(frame);
        });
    }

    cancel(): void {
        if (this.animId !== null) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
    }

    get isAnimating(): boolean {
        return this.animId !== null;
    }
}
