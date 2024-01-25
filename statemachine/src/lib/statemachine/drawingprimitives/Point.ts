export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static get zero(): Point {
        return new Point(0, 0);
    }

    distance(point: Point): number {
        const deltaX = this.x - point.x;
        const deltaY = this.y - point.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    // Moves this point into the direction of the given point, by a specific amount.
    moveToPoint(point: Point, amount: number): Point {
        const distance = this.distance(point);

        const newDistance = distance - amount;

        const vecP1P2x = point.x - this.x;
        const vecP1P2y = point.y - this.y;

        let unitVecX = 0;
        let unitVecY = 0;

        if (distance != 0) {
            unitVecX = vecP1P2x / distance;
            unitVecY = vecP1P2y / distance;
        }

        const newPointX = point.x - newDistance * unitVecX;
        const newPointY = point.y - newDistance * unitVecY;

        return new Point(newPointX, newPointY);
    }

    addPoint(point: Point): Point {
        return new Point(this.x + point.x, this.y + point.y);
    }

    get perpendicular(): Point {
        return new Point(this.y, -this.x);
    }

    toJSON(): any {
        return {
            x: this.x,
            y: this.y,
        };
    }
}
