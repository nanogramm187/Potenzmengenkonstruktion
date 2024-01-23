import { Edge } from './edge';
import { Point } from './drawingprimitives/Point';

export abstract class StateGraphic {
    static circleRadius: number = 30;

    origin: Point;

    name: string;

    id: number;

    innerCircleHovered: boolean = false;

    outerCircleHovered: boolean = false;

    get x(): number {
        return this.origin.x;
    }

    set x(x: number) {
        this.origin.x = x;
    }

    get y(): number {
        return this.origin.y;
    }

    set y(y: number) {
        this.origin.y = y;
    }

    get r(): number {
        return StateGraphic.circleRadius;
    }

    static get innerCircleRadius(): number {
        return StateGraphic.circleRadius / 2;
    }

    constructor(origin: Point, id?: number, name?: string) {
        let newID = id ?? 0;

        while (this.ids.has(newID)) {
            newID++;
        }

        this.id = newID;
        this.addID(newID);

        this.origin = origin;
        this.name = name ?? 'S' + this.id;
    }

    getConnectionPointToState(destination: StateGraphic): Point {
        return destination.origin.moveToPoint(
            this.origin,
            StateGraphic.circleRadius
        );
    }

    abstract isDeterministic(): boolean;

    abstract hasConnectionTo(destination: StateGraphic): boolean;

    abstract getEdgesTo(destination: StateGraphic): Edge[];

    get ids(): Set<number> {
        return new Set();
    }

    addID(id: number) {}

    toJSON(): any {
        return {
            id: this.id,
            origin: this.origin,
            name: this.name,
        };
    }
}
