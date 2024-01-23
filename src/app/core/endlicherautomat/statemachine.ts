import { Configuration } from "./configuration";
import { State } from "./state";

export abstract class StateMachine {

    title: string = "";
    description: string = "";

    abstract states: Set<State>;
    abstract start?: State;
    abstract finals: Set<State>;
    abstract addState(x: number, y: number, id?: number, name?: string): State;
    abstract deleteState(state: State): void;
    abstract accepting(word: string): Configuration[];

    isDeterministic(): boolean {
        return ![...this.states].some((state) => !state.isDeterministic());
    }

    toJSON(): Object {
        return {
            title: this.title,
            description: this.description,
            circleRadius: State.circleRadius,
            startState: this.start?.id,
            finalStates: [...this.finals].map((s) => s.id),
            states: [...this.states],
        };
    }
}
