import { Automata } from './automata';
import { Point } from './drawingprimitives/Point';
import { TuringEdge } from './turingedges';
import { TuringState } from './turingstate';
import { State } from './state';
import { Direction } from './turingedges';
import { Configuration } from './configuration';
import { Tapecontent } from './tapecontent';

export class Turingmachine extends Automata {
   
    states = new Set<TuringState>();

    start?: TuringState;

    finals: Set<TuringState> = new Set();

    constructor() {
        super();
        TuringState.resetIDs();
    }

    startConfiguration(word: string): Configuration | undefined {
        if (this.start === undefined) { return undefined; }
        return new Configuration(this.start, new Tapecontent(word), this);
    }

    override accepting(word: string): Configuration[] {
        const automataStartConfiguration = this.startConfiguration(word);
        if (automataStartConfiguration === undefined) { return []; }
        
        let configurations = [automataStartConfiguration];
        let finalConfigurations: Configuration[] = [];
    
        while (configurations.length > 0  && finalConfigurations.length == 0) {
            configurations = configurations.flatMap((config) => {
                let newConfigs = config.move();
                finalConfigurations = newConfigs.filter((config) => config.isAccepting);
                return newConfigs;
            });
        }
    
        return finalConfigurations;
    }
    
    override addState(
        x: number,
        y: number,
        id?: number,
        name?: string
    ): TuringState {
        const origin = new Point(x, y);

        const state = new TuringState(origin, id, name);

        // Add new state as start state, if there is no start state.
        if (this.start == undefined) {
            this.start = state;
        }

        this.states = new Set([...this.states, state]);

        state.edges.automata = this;

        return state;
    }

    addTransition(start: TuringState, goal: TuringState, token: string, writeSymbol: string, direction: Direction): TuringEdge {
        const newEdge = new TuringEdge(start, goal, token, writeSymbol, direction);
        start.edges.appendEdge(newEdge);
        return newEdge;
    }

    override deleteState(state: State): void {
        if (!(state instanceof TuringState)) {
            return;
        }

        const nfaState: TuringState = state as TuringState;

        TuringState.remove(state.id);

        // Remove start if state is start state.
        if (this.start == state) {
            this.start = undefined;
        }

        if (this.states.has(nfaState)) {
            // Remove transitions where 'state' is the destination state
            for (const otherState of this.states) {
                otherState.edges
                    .getEdgesTo(nfaState)
                    .forEach((edge) => edge.delete());
            }

            this.states.delete(nfaState);
        }
    }

    static fromJSON(object: any): Turingmachine {
        const automata = new Turingmachine();

        const states = new Map<number, TuringState>();
        const finalStates = new Set<number>();

        for (const finalStateID of object.finalStates) {
            finalStates.add(finalStateID);
        }

        // Create all states
        for (const state of object.states) {
            const newState = automata.addState(
                state.origin.x,
                state.origin.y,
                state.id,
                state.name
            );
            states.set(state.id, newState);
        }

        for (const jsonState of object.states) {
            const state = states.get(jsonState.id);

            if (state == undefined) {
                continue;
            }

            // Set start state
            if (state.id == object.startState) {
                automata.start = states.get(state.id);
            }

            // Set final states
            if (finalStates.has(state.id)) {
                const finalState = states.get(state.id);
                if (finalState != undefined) {
                    automata.finals.add(finalState);
                }
            }

            // Add transitions
            for (const edge of jsonState.edges) {
                const successor = states.get(edge.dstState);
                if (successor != undefined) {
                    automata.addTransition(state, successor, edge.transitionSymbol, edge.writeSymbol, edge.direction);
                }
            }
        }

        State.circleRadius = object.circleRadius;

        automata.title = object.title;
        automata.description = object.description;

        return automata;
    }
}
