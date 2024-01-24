import { Arrow } from "../drawingprimitives/Arrow";
import { CubicBezierCurve } from "../drawingprimitives/BezierCurve";
import { Point } from "../drawingprimitives/Point";
import { State } from "../state";
import { Label } from "./Label";
import { StateConnection } from "./StateConnection";

export class SelfStateConnection extends StateConnection {
    
    private width = State.circleRadius * 2;
    private height = State.circleRadius * 2;

    override path(source: State, destination: State): string {
        return this.connectionCurve(source, destination).path();
    }

    // override labels(): Label[] {
    //     throw new Error("Method not implemented.");
    // }

    // private getLabelPosition(width: number, height: number): Point {
    //     return this.connectionCurve
    //         .pointSecant(0.5)
    //         .getRectangleCenterPoint(width, height);
    // }

    private connectionCurve(source: State, destination: State): CubicBezierCurve {
        const controlPointY = source.origin.y - this.height;

        // Compute the first and second path control points.
        let c1 = new Point(source.origin.x + this.width / 2, controlPointY);
        let c2 = new Point(source.origin.x - this.width / 2, controlPointY);

        // Compute the start and end points of the path.
        const start = this.computeStartPoint(source, c1);
        const end = this.computeEndPoint(source, c2);

        // Adjust the first path control point.
        c2 = this.computeControlPoint(start, c2);

        return new CubicBezierCurve(end, c2, c1, start);
    }

    // This method computes the start point of the path.
    private computeStartPoint(source: State, c1: Point): Point {
        let start = source.origin.moveToPoint(
            c1,
            State.circleRadius
        );
        return start.moveToPoint(c1, Arrow.transition.width * 2);
    }

    // This method computes the end point of the path.
    private computeEndPoint(source: State, c2: Point): Point {
        return source.origin.moveToPoint(c2, State.circleRadius);
    }

    // This method adjusts the first path control point.
    private computeControlPoint(start: Point, c1: Point): Point {
        return c1.moveToPoint(start, -Arrow.transition.width);
    }
}