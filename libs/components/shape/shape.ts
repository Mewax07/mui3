import { Component, Html, prop } from "../../utils";
import { WithEnumMethod } from "../../utils/types";
import { ShapeType } from "./shape.style";

export type ShapeValue = ShapeType;

export interface Button extends WithEnumMethod<"shape", ShapeType, Button> {}

export class Shape extends Component {
    @prop("enum", {
        enumValues: ShapeType,
    })
    private shape: ShapeType = ShapeType.CIRCLE;

    constructor(shape: ShapeValue) {
        super();
        this.shape = shape;
    }

    protected template(): Html {
        const container = new Html();

        return container;
    }
}
