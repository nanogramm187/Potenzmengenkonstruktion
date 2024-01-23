import { Arrow } from "../drawingprimitives/Arrow";
import { CubicBezierCurve } from "../drawingprimitives/BezierCurve";
import { Point } from "../drawingprimitives/Point";
import { State } from "../state";
import { StateConnection } from "./StateConnection";

export class SelfStateConnection extends StateConnection {

    private width = State.circleRadius * 2;
    private height = State.circleRadius * 2;

    private get connectionCurve(): CubicBezierCurve {
        const controlPointY = this.source.origin.y - this.height;

        // Compute the first and second path control points.
        let c1 = new Point(this.source.origin.x + this.width / 2, controlPointY);
        let c2 = new Point(this.source.origin.x - this.width / 2, controlPointY);

        // Compute the start and end points of the path.
        const start = this.computeStartPoint(c1);
        const end = this.computeEndPoint(c2);

        // Adjust the first path control point.
        c2 = this.computeControlPoint(start, c2);

        return new CubicBezierCurve(end, c2, c1, start);
    }

    path(): string {
        return this.connectionCurve.path();
    }

    override getTextPosition(width: number, height: number): Point {
        return this.connectionCurve
            .pointSecant(0.5)
            .getRectangleCenterPoint(width, height);
    }

    // This method computes the start point of the path.
    private computeStartPoint(c1: Point): Point {
        let start = this.source.origin.moveToPoint(
            c1,
            State.circleRadius
        );
        return start.moveToPoint(c1, Arrow.transition.width * 2);
    }

    // This method computes the end point of the path.
    private computeEndPoint(c2: Point): Point {
        return this.source.origin.moveToPoint(c2, State.circleRadius);
    }

    // This method adjusts the first path control point.
    private computeControlPoint(start: Point, c1: Point): Point {
        return c1.moveToPoint(start, -Arrow.transition.width);
    }
}