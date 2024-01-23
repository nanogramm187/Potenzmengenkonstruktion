import { Point } from './drawingprimitives/Point';
import { TuringEdge, TuringEdges } from './turingedges';
import { StateGraphic } from './stategraphic';

export class TuringState extends StateGraphic {
    private static _ids = new Set<number>();

    override get ids(): Set<number> {
        return TuringState._ids;
    }

    override addID(id: number) {
        TuringState._ids.add(id);
    }

    static remove(id: number) {
        TuringState._ids.delete(id);
    }

    static resetIDs() {
        TuringState._ids = new Set<number>();
    }

    edges = new TuringEdges();

    constructor(origin: Point, id?: number, name?: string) {
        super(origin, id, name);
    }

    getEdgesTo(destination: TuringState): TuringEdge[] {
        return this.edges.getEdgesTo(destination);
    }

    override hasConnectionTo(destination: TuringState): boolean {
        return this.edges.isConnectedTo(destination);
    }

    isDeterministic(): boolean {
        const counter = new Map<string, number>();

        for (const edge of this.edges.edges) {
           
            const currentCount = counter.get(edge.transitionSymbol) ?? 1;

            if (currentCount > 1) {
                return false;
            }

            counter.set(edge.transitionSymbol, currentCount + 1);
        }

        return true;
    }

    override toJSON(): any {
        let state = super.toJSON();
        state.id = this.id;
        state.edges = this.edges.edges;
        return state;
    }
}
