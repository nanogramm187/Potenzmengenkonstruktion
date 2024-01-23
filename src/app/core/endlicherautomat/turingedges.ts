import { Edge, Edges } from './edge';
import { TuringState } from './turingstate';

export class TuringEdges extends Edges {
    override edges: TuringEdge[] = [];

    getEdgesTo(destination: TuringState): TuringEdge[] {
        return this.edges.filter((edge) => edge.dstState === destination && !edge.isDummy());
    }

    getTransitions(transitionSymbol: string): TuringEdge[] {
        return this.edges.filter(
            (edge) => edge.transitionSymbol == transitionSymbol
        );
    }

    hasTransition(transitionSymbol: string, dstState: TuringState): boolean {
        return this.edges.some(
            (edge) =>
                edge.transitionSymbol == transitionSymbol &&
                edge.dstState === dstState
        );
    }
}

export class TuringEdge extends Edge {
    private _transitionSymbol: string;
    private _writeSymbol: string;
    private _direction: Direction;

    constructor(
        srcState: TuringState,
        dstState: TuringState,
        transitionSymbol: string,
        writeSymbol: string,
        direction: Direction
    ) {
        super(srcState, dstState);
        this._transitionSymbol = transitionSymbol;
        this._writeSymbol = writeSymbol;
        this._direction = direction;
    }

    public get transitionSymbol(): string {
        return this._transitionSymbol;
    }

    public set transitionSymbol(value: string) {
        if (value == '') {
            return;
        }
        this._transitionSymbol = value;
    }

    public get writeSymbol(): string {
        return this._writeSymbol;
    }

    public set writeSymbol(value: string) {
        if (value == '') {
            return;
        }
        this._writeSymbol = value;
    }

    public get direction(): Direction {
        return this._direction;
    }

    public set direction(value: Direction) {
        this._direction = value;
    }

    public override get srcState(): TuringState {
        return super.srcState as TuringState;
    }

    public override get dstState(): TuringState {
        return super.dstState as TuringState;
    }

    override transitionLabel(): string {
        if (this.transitionSymbol == '' && this.writeSymbol == '' && this.direction == 'N') {
            return '';
        }
        return this.transitionSymbol + ' / ' + this.writeSymbol + ', ' + this.direction;
    }

    isDummy(): boolean {
        return this.transitionSymbol == '' && this.writeSymbol == '' && this.direction == 'N';
    }

    delete(): void {
        this.srcState.edges.delete(this);
    }

    toJSON(): any {
        return {
            srcState: this.srcState.id,
            dstState: this.dstState.id,
            transitionSymbol: this.transitionSymbol,
            writeSymbol: this.writeSymbol,
            direction: this.direction,
        };
    }
}

export enum Direction {
    Left = 'L',
    Right = 'R',
    None = 'N'
}
