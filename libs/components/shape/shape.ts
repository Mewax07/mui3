import { shape_data } from "../../../ignored/shape.data.old";
import { Component, Html, prop, Svg } from "../../utils";
import { WithEnumMethod } from "../../utils/types";
import { MorphOptions, ShapeMorpher } from "./shape.morph";
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

        const svg = Svg.svg()
            .attr("viewBox", `0 0 ${def.vbW} ${def.vbH}`)
            .attr("width", "80")
            .attr("height", "80")
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
        const def = shape_data[nextType];
        const toPath = def.path;

        if (!toPath) {
            console.warn(`[Shape] Path inconnu pour : ${next}`);
            return Promise.resolve();
        }

        if (!this.morpher) {
            this.shape = nextType;
            return Promise.resolve();
        }

        const fromPath = this.morpher.getCurrent();

        this.svg?.attr("viewBox", `0 0 ${def.vbW} ${def.vbH}`);

        return this.morpher
            .morph(cleanSvgPath(fromPath), cleanSvgPath(toPath), options)
            .then(() => {
                this.shape = nextType;
                this._root.dataset("shape", nextType);
            });
    }

    public async bounce() {
        const shapeKeys = Object.values(ShapeType);
        let currentIndex = 0;

        const loop = async () => {
            currentIndex = (currentIndex + 1) % shapeKeys.length;
            await this.transitionTo(shapeKeys[currentIndex], {
                duration: 600,
                easing: "bounce",
            });
            setTimeout(loop, 800);
        };

        setTimeout(loop, 800);
    }
}
