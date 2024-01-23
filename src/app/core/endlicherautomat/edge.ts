import { State } from './state';
import { StateMachine } from './statemachine';

export abstract class Edges {

    statemachine?: StateMachine;

    edges: Edge[] = [];

    appendEdge(edge: Edge) {
        this.edges.push(edge);
    }

    delete(edge: Edge) {
        this.edges = this.edges.filter((e) => e !== edge);
    }

    isConnectedTo(destination: State): boolean {
        return this.edges.some((edge) => edge.dstState === destination);
    }

    abstract getEdgesTo(destination: State): Edge[];
}

export abstract class Edge {
    private _srcState: State;
    private _dstState: State;

    public get srcState(): State {
        return this._srcState;
    }

    public set srcState(value: State) {
        this._srcState = value;
    }

    public get dstState(): State {
        return this._dstState;
    }

    public set dstState(value: State) {
        this._dstState = value;
    }

    constructor(srcState: State, dstState: State) {
        this._srcState = srcState;
        this._dstState = dstState;
    }

    abstract transitionLabel(): string;

    abstract delete(): void;
}
