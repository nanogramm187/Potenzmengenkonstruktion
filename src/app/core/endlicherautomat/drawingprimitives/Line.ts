import { Point } from './Point';
import { Shape } from './Shape';

export class Line implements Shape {
    sourcePoint: Point;
    destinationPoint: Point;

    constructor(p1: Point, p2: Point) {
        this.sourcePoint = p1;
        this.destinationPoint = p2;
    }

    // Gets a control point to draw a bezier curve.
    //
    // The control point with a specific `distance` to the line.
    // The point will be on the left side of the line.
    getBezierControlPoint(distance: number): Point {
        // calculate the vector from the source point to the destination point
        const vecSource = new Point(this.sourcePoint.x, this.sourcePoint.y);
        const vecDestination = new Point(
            this.destinationPoint.x - this.sourcePoint.x,
            this.destinationPoint.y - this.sourcePoint.y
        );

        // calculate the length of the vector
        const vecDestinationLength = this.sourcePoint.distance(
            this.destinationPoint
        );

        // calculate the unit vector in the direction of the destination point
        let vecDestinationUnit = Point.zero;

        if (vecDestinationLength !== 0) {
            vecDestinationUnit = new Point(
                vecDestination.x / vecDestinationLength,
                vecDestination.y / vecDestinationLength
            );
        }

        // calculate the control point halfway between the source and destination points
        const vecStartControl = new Point(
            vecSource.x + vecDestination.x / 2,
            vecSource.y + vecDestination.y / 2
        );

        // use the unit vector and the given distance to calculate the final control point
        const vecEndControl = new Point(
            vecStartControl.x + distance * vecDestinationUnit.y,
            vecStartControl.y - distance * vecDestinationUnit.x
        );

        return vecEndControl;
    }

    getRectangleCenterPoint(width: number, height: number): Point {
        const { x: x1, y: y1 } = this.sourcePoint;
        const { x: x2, y: y2 } = this.vector;

        const x3 =
            this.center.x +
            (this.sourcePoint.y < this.destinationPoint.y
                ? -width / 2
                : width / 2);
        const y3 =
            this.center.y +
            (this.sourcePoint.x < this.destinationPoint.x
                ? height / 2
                : -height / 2);

        const s = (x2 * (y3 - y1) + y2 * (x1 - x3)) / (y2 * y2 + x2 * x2);

        const x = this.center.x + s * y2;
        const y = this.center.y - s * x2;

        return new Point(x, y);
    }

    get vector(): Point {
        return new Point(
            this.destinationPoint.x - this.sourcePoint.x,
            this.destinationPoint.y - this.sourcePoint.y
        );
    }

    length(): number {
        return this.sourcePoint.distance(this.destinationPoint);
    }

    get center(): Point {
        return new Point(
            (this.sourcePoint.x + this.destinationPoint.x) / 2,
            (this.sourcePoint.y + this.destinationPoint.y) / 2
        );
    }

    path(): string {
        return (
            'M' +
            this.sourcePoint.x +
            ' ' +
            this.sourcePoint.y +
            ', ' +
            this.destinationPoint.x +
            ' ' +
            this.destinationPoint.y
        );
    }
}
