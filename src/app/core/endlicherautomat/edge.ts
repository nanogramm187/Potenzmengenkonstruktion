import { StateGraphic } from './stategraphic';
import { Automata } from './automata';

export abstract class Edges {
    automata?: Automata;

    edges: Edge[] = [];

    appendEdge(edge: Edge) {
        this.edges.push(edge);
    }

    delete(edge: Edge) {
        this.edges = this.edges.filter((e) => e !== edge);
    }

    abstract getEdgesTo(destination: StateGraphic): Edge[];

    isConnectedTo(destination: StateGraphic): boolean {
        return this.edges.some((edge) => edge.dstState === destination);
    }
}

export abstract class Edge {
    private _srcState: StateGraphic;
    private _dstState: StateGraphic;

    public get srcState(): StateGraphic {
        return this._srcState;
    }

    public set srcState(value: StateGraphic) {
        this._srcState = value;
    }

    public get dstState(): StateGraphic {
        return this._dstState;
    }

    public set dstState(value: StateGraphic) {
        this._dstState = value;
    }

    constructor(srcState: StateGraphic, dstState: StateGraphic) {
        this._srcState = srcState;
        this._dstState = dstState;
    }

    abstract transitionLabel(): string;

    abstract delete(): void;
}
