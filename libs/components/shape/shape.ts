import { Component, Html, prop } from "../../utils";
import { WithEnumMethod } from "../../utils/types";
import { ShapeType } from "./shape.style";

export type ShapeValue = `${ShapeType}`;

export interface Shape extends WithEnumMethod<"shape", ShapeType, Shape> {}

export class Shape extends Component {
    @prop("enum", {
        enumValues: ShapeType,
    })
    private shape: ShapeType = ShapeType.CIRCLE;

    constructor(shape: ShapeValue) {
        super();
        this.shape = shape as ShapeType;
    }

    protected template(): Html {
        const container = new Html()
            .class("shape")
            .dataset("shape", this.shape)
            .append(new Html());

        return container;
    }
}
