import { Point } from "../drawingprimitives/Point";
import { State } from "../state";

export abstract class StateConnection {
    constructor(public source: State, public destination: State) {}
    abstract path(): string;
    abstract calculateRectanglePlacementAbovePath(width: number, height: number): Point;
}