import { Edge } from './edge';
import { Point } from './drawingprimitives/Point';

export abstract class State {

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
        return State.circleRadius;
    }

    static get innerCircleRadius(): number {
        return State.circleRadius / 2;
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

    getConnectionPointToState(destination: State): Point {
        return destination.origin.moveToPoint(
            this.origin,
            State.circleRadius
        );
    }

    abstract isDeterministic(): boolean;

    abstract hasConnectionTo(destination: State): boolean;

    abstract getEdgesTo(destination: State): Edge[];

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
