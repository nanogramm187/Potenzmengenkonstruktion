import { Arrow } from "../drawingprimitives/Arrow";
import { BezierCurve } from "../drawingprimitives/BezierCurve";
import { Line } from "../drawingprimitives/Line";
import { Point } from "../drawingprimitives/Point";
import { State } from "../state";
import { StateConnection } from "./StateConnection";

export class BidirectionalStateConnection extends StateConnection {
    private get controlPointDistance(): number {
        return State.circleRadius * 2;
    }

    private get connectionCurve(): BezierCurve {
        const connectionLine = new Line(
            this.source.origin,
            this.destination.origin
        );
        const controlPoint = connectionLine.getBezierControlPoint(
            this.controlPointDistance
        );
        const sourcePoint = this.source.origin.moveToPoint(
            controlPoint,
            State.circleRadius
        );
        let destinationPoint = this.destination.origin.moveToPoint(
            controlPoint,
            State.circleRadius
        );
        destinationPoint = destinationPoint.moveToPoint(
            controlPoint,
            Arrow.transition.width * 2
        );
        return new BezierCurve(sourcePoint, controlPoint, destinationPoint);
    }

    override path(): string {
        return this.connectionCurve.path();
    }

    override getTextPosition(width: number, height: number): Point {
        return this.connectionCurve
            .pointSecant(0.5)
            .getRectangleCenterPoint(width, height);
    }
}