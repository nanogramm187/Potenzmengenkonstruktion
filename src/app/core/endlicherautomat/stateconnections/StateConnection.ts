import { Shape } from '../drawingprimitives/Shape';
import { State } from '../state';
import { Point } from '../drawingprimitives/Point';
import { Edge } from '../edge';
import { Size } from '../drawingprimitives/Size';

export abstract class StateConnection implements Shape {
    source: State;
    destination: State;
    edges: Edge[];
    arrowHeadSize: Size = new Size(10, 10);

    constructor(source: State, destination: State) {
        this.source = source;
        this.destination = destination;
        this.edges = source.getEdgesTo(destination);
    }

    abstract path(): string;

    abstract getTextPosition(width: number, height: number): Point;
}