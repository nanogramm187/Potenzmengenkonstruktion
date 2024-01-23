import { Point } from './Point';
import { Shape } from './Shape';

export class Arrow implements Shape {
    width: number;
    height: number;

    refX: number;
    refY: number;

    private lowerLeft: Point;
    private upperLeft: Point;
    private centerRight: Point;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.lowerLeft = new Point(0, 0);
        this.upperLeft = new Point(0, this.height);
        this.centerRight = new Point(this.width, this.height / 2);
        this.refX = 0;
        this.refY = this.centerRight.y;
    }

    /// Returns an arrow for a transition
    static transition: Arrow = new Arrow(7.5, 5);

    path(): string {
        return (
            this.lowerLeft.x +
            ' ' +
            this.lowerLeft.y +
            ', ' +
            this.upperLeft.x +
            ' ' +
            this.upperLeft.y +
            ', ' +
            this.centerRight.x +
            ' ' +
            this.centerRight.y
        );
    }
}
