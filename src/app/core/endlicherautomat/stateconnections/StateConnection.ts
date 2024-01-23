import { Shape } from '../drawingprimitives/Shape';
import { StateGraphic } from '../stategraphic';
import { Point } from '../drawingprimitives/Point';
import { Edge } from '../edge';
import { Size } from '../drawingprimitives/Size';

export abstract class StateConnection implements Shape {
    source: StateGraphic;
    destination: StateGraphic;
    edges: Edge[];
    arrowHeadSize: Size = new Size(10, 10);

    constructor(source: StateGraphic, destination: StateGraphic) {
        this.source = source;
        this.destination = destination;
        this.edges = source.getEdgesTo(destination);
    }

    abstract path(): string;

    abstract getTextPosition(width: number, height: number): Point;
}