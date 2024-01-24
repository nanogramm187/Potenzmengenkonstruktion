import { Line } from './Line';
import { Point } from './Point';
import { Shape } from './Shape';

// This class represents a Bezier curve.
export class BezierCurve implements Shape {
    // These are the three points that define the curve.
    p1: Point;
    p2: Point;
    p3: Point;

    // The constructor initializes the points that define the curve.
    constructor(p1: Point, p2: Point, p3: Point) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    pointSecant(t: number): Line {
        // We first compute two intermediate points on the curve.
        const p12 = this.lerp(this.p1, this.p2, t);
        const p23 = this.lerp(this.p2, this.p3, t);
        // We then use these intermediate points to compute the final point on the curve.
        return new Line(p12, p23);
    }

    // This method computes a point on the curve for a given value of "t".
    pointOnCurve(t: number): Point {
        const secant = this.pointSecant(t);
        // We then use these intermediate points to compute the final point on the curve.
        return this.lerp(secant.sourcePoint, secant.destinationPoint, t);
    }

    // This method performs linear interpolation between two points.
    lerp(p1: Point, p2: Point, t: number): Point {
        // We compute the new x-coordinate by linearly interpolating between the x-coordinates of the two input points.
        const x = p1.x + (p2.x - p1.x) * t;
        // We do the same for the y-coordinate.
        const y = p1.y + (p2.y - p1.y) * t;
        // We return a new point with the interpolated coordinates.
        return new Point(x, y);
    }

    path(): string {
        return 'M' +
            this.p1.x +
            ' ' +
            this.p1.y +
            ' Q' +
            this.p2.x +
            ' ' +
            this.p2.y +
            ' ' +
            this.p3.x +
            ' ' +
            this.p3.y
    }
}

// This class represents a Bezier curve.
export class CubicBezierCurve extends BezierCurve {
    p4: Point;

    // The constructor initializes the points that define the curve.
    constructor(p1: Point, p2: Point, p3: Point, p4: Point) {
        super(p1, p2, p3);
        this.p4 = p4;
    }

    override pointSecant(t: number): Line {
        const p12 = this.lerp(this.p1, this.p2, t);
        const p23 = this.lerp(this.p2, this.p3, t);
        const p34 = this.lerp(this.p3, this.p4, t);
        const p123 = this.lerp(p12, p23, t);
        const p234 = this.lerp(p23, p34, t);
        return new Line(p123, p234);
    }

    // This method computes a point on the curve for a given value of "t".
    override pointOnCurve(t: number): Point {
        const secant = this.pointSecant(t);
        // We then use these intermediate points to compute the final point on the curve.
        return this.lerp(secant.sourcePoint, secant.destinationPoint, t);
    }

    override path(): string {
        return 'M' +
            this.p1.x +
            ' ' +
            this.p1.y +
            ' C' +
            this.p2.x +
            ' ' +
            this.p2.y +
            ' ' +
            this.p3.x +
            ' ' +
            this.p3.y +
            ' ' +
            this.p4.x +
            ' ' +
            this.p4.y
    }
}
