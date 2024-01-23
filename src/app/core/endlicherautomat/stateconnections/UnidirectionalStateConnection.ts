import { Line } from "../drawingprimitives/Line";
import { Point } from "../drawingprimitives/Point";
import { Arrow } from "../drawingprimitives/Arrow";
import { State } from "../state";
import { StateConnection } from "./StateConnection";

export class UnidirectionalStateConnection extends StateConnection {
    // This method computes the line that connects the source and destination states.
    private getConnectionLine(): Line {
        // Compute the source point of the line.
        const sourcePoint = this.computeSourcePoint();

        // Compute the destination point of the line.
        const destinationPoint = this.computeDestinationPoint();

        // Return a new line with the computed points.
        return new Line(sourcePoint, destinationPoint);
    }

    override path(): string {
        return this.getConnectionLine().path();
    }

    override getTextPosition(widht: number, height: number): Point {
        const line = new Line(this.source.origin, this.destination.origin);
        const point = line.getRectangleCenterPoint(widht, height);
        return point;
    }

    // This method computes the source point of the line that connects the source and destination states.
    private computeSourcePoint(): Point {
        return this.source.origin.moveToPoint(
            this.destination.origin,
            State.circleRadius
        );
    }

    // This method computes the destination point of the line that connects the source and destination states.
    private computeDestinationPoint(): Point {
        return this.destination.origin
            .moveToPoint(this.source.origin, State.circleRadius)
            .moveToPoint(this.source.origin, Arrow.transition.width * 2);
    }
}
