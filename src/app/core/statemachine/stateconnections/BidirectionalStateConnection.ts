import { Arrow } from "../drawingprimitives/Arrow";
import { BezierCurve } from "../drawingprimitives/BezierCurve";
import { Line } from "../drawingprimitives/Line";
import { State } from "../state";
import { StateConnection } from "./StateConnection";

export class BidirectionalStateConnection extends StateConnection {
    private get controlPointDistance(): number {
        return State.circleRadius * 2;
    }

    private connectionCurve(source: State, destination: State): BezierCurve {
        const connectionLine = new Line(
            source.origin,
            destination.origin
        );
        const controlPoint = connectionLine.getBezierControlPoint(
            this.controlPointDistance
        );
        const sourcePoint = source.origin.moveToPoint(
            controlPoint,
            State.circleRadius
        );
        let destinationPoint = destination.origin.moveToPoint(
            controlPoint,
            State.circleRadius
        );
        destinationPoint = destinationPoint.moveToPoint(
            controlPoint,
            Arrow.transition.width * 2
        );
        return new BezierCurve(sourcePoint, controlPoint, destinationPoint);
    }

    override path(source: State, destination: State): string {
        return this.connectionCurve(source, destination).path();
    }

    // override getLabelPosition(width: number, height: number): Point {
    //     return this.connectionCurve
    //         .pointSecant(0.5)
    //         .getRectangleCenterPoint(width, height);
    // }
}