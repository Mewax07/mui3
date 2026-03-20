import { shape_data } from "../../../ignored/shape.data.old";
import { Component, Html, prop, Svg } from "../../utils";
import { WithEnumMethod } from "../../utils/types";
import { EASINGS, MorphOptions, ShapeMorpher } from "./shape.morph";
import { cleanSvgPath, ShapeType } from "./shape.style";

export type ShapeValue = `${ShapeType}`;

export interface Shape extends WithEnumMethod<"shape", ShapeType, Shape> {}

export class Shape extends Component {
    @prop("enum", {
        enumValues: ShapeType,
    })
    private shape: ShapeType = ShapeType.CIRCLE;
    private morpher: ShapeMorpher | null = null;

    private svg: Svg | null = null;

    constructor(shape: ShapeValue) {
        super();
        this.shape = shape as ShapeType;
    }

    protected template(): Html {
        const def = shape_data[this.shape];
        const w = (def.vbW * 80) / 380;
        const h = (def.vbH * 80) / 380;

        const svg = Svg.svg()
            .attr("viewBox", `0 0 ${def.vbW} ${def.vbH}`)
            .attr("width", String(w))
            .attr("height", String(h))
            .append(
                Svg.el("path")
                    .attr("d", cleanSvgPath(def.path))
                    .attr("fill", "currentColor"),
            );

        this.svg = svg;

        return new Html()
            .class("shape")
            .dataset("shape", this.shape)
            .append(svg.elm);
    }

    protected override onMount(): void {
        const pathEl = this._root.qs("path")
            ?.elm as unknown as SVGPathElement | null;
        if (pathEl) {
            this.morpher = new ShapeMorpher(pathEl);
        }
    }

    public async transitionTo(
        next: ShapeValue,
        options: MorphOptions = {},
    ): Promise<void> {
        const nextType = next as ShapeType;
        const toDef = shape_data[nextType];
        const fromDef = shape_data[this.shape];

        if (!toDef || !this.morpher || !this.svg) {
            this.shape = nextType;
            return;
        }

        const fromW = (fromDef.vbW * 80) / 380;
        const fromH = (fromDef.vbH * 80) / 380;
        const toW = (toDef.vbW * 80) / 380;
        const toH = (toDef.vbH * 80) / 380;

        const fromPath = this.morpher.getCurrent();
        const toPath = cleanSvgPath(toDef.path);

        const duration = options.duration ?? 600;
        const ease = EASINGS[options.easing ?? "easeInOut"];
        const start = performance.now();

        const sizeFrame = (now: number) => {
            const raw = Math.min((now - start) / duration, 1);
            const t = ease(raw);

            const w = fromW + (toW - fromW) * t;
            const h = fromH + (toH - fromH) * t;

            this.svg!.attr("width", w.toFixed(2))
                .attr("height", h.toFixed(2))
                .attr(
                    "viewBox",
                    `0 0 ${fromDef.vbW + (toDef.vbW - fromDef.vbW) * t} ${
                        fromDef.vbH + (toDef.vbH - fromDef.vbH) * t
                    }`,
                );

            if (raw < 1) requestAnimationFrame(sizeFrame);
        };

        requestAnimationFrame(sizeFrame);

        return this.morpher.morph(fromPath, toPath, options).then(() => {
            this.shape = nextType;
            this._root.dataset("shape", nextType);
            // snap final
            this.svg!.attr("width", String(toW))
                .attr("height", String(toH))
                .attr("viewBox", `0 0 ${toDef.vbW} ${toDef.vbH}`);
        });
    }

    public async bounce() {
        const shapeKeys = Object.values(ShapeType);
        let currentIndex = 0;

        const loop = async () => {
            currentIndex = (currentIndex + 1) % shapeKeys.length;
            await this.transitionTo(shapeKeys[currentIndex], {
                duration: 600,
                easing: "easeOut",
            });
            setTimeout(loop, 800);
        };

        setTimeout(loop, 800);
    }
}
