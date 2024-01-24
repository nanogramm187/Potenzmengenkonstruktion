import { Line } from "../drawingprimitives/Line";
import { Point } from "../drawingprimitives/Point";
import { Arrow } from "../drawingprimitives/Arrow";
import { State } from "../state";
import { StateConnection } from "./StateConnection";


export class UnidirectionalStateConnection extends StateConnection {
    // This method computes the line that connects the source and destination states.
    private getConnectionLine(source: State, destination: State): Line {
        // Compute the source point of the line.
        const sourcePoint = this.computeSourcePoint(source, destination);

        // Compute the destination point of the line.
        const destinationPoint = this.computeDestinationPoint(source, destination);

        // Return a new line with the computed points.
        return new Line(sourcePoint, destinationPoint);
    }

    override path(source: State, destination: State): string {
        return this.getConnectionLine(source, destination).path();
    }

    // override getLabelPosition(widht: number, height: number): Point {
    //     const line = new Line(this.source.origin, this.destination.origin);
    //     const point = line.getRectangleCenterPoint(widht, height);
    //     return point;
    // }

    // This method computes the source point of the line that connects the source and destination states.
    private computeSourcePoint(source: State, destination: State): Point {
        return source.origin.moveToPoint(
            destination.origin,
            State.circleRadius
        );
    }

    // This method computes the destination point of the line that connects the source and destination states.
    private computeDestinationPoint(source: State, destination: State): Point {
        return destination.origin
            .moveToPoint(source.origin, State.circleRadius)
            .moveToPoint(source.origin, Arrow.transition.width * 2);
    }
}
