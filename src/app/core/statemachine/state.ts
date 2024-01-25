import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Point } from './drawingprimitives/Point';
import { Transition } from './stateconnections/Transition';

export abstract class State {

    origin: Point;

    name: string;

    id: number;

    innerCircleHovered: boolean = false;

    outerCircleHovered: boolean = false;

    transitions: Set<Transition> = new Set();

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

    static get circleRadius(): number {
        return 30;
    }

    get r(): number {
        return State.circleRadius;
    }

    static get innerCircleRadius(): number {
        return State.circleRadius / 2;
    }

    constructor(origin: Point) {
        this.origin = origin;
        this.name = "";
        this.id = 0;
    }

    getConnectionPointToState(destination: State): Point {
        return destination.origin.moveToPoint(
            this.origin,
            State.circleRadius
        );
    }

    hasConnectionTo(state: State): boolean {
        return [...this.transitions].some((transition) => {
            return transition.destination === state;
        });
    }

    toJSON(): any {
        return {
            id: this.id,
            origin: this.origin,
            name: this.name,
        };
    }

    abstract openEditDialog(dialog: MatDialog): MatDialogRef<any, any>;

    abstract isDeterministic(): boolean;
}
