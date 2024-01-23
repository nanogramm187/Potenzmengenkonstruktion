import { Configuration } from "./configuration";
import { StateGraphic } from "./stategraphic";

export abstract class Automata {

    title: string = "";
    description: string = "";

    abstract states: Set<StateGraphic>;
    abstract start?: StateGraphic;
    abstract finals: Set<StateGraphic>;
    abstract addState(
        x: number,
        y: number,
        id?: number,
        name?: string
    ): StateGraphic;
    abstract deleteState(state: StateGraphic): void;

    abstract accepting(word: string): Configuration[];

    isDeterministic(): boolean {
        return ![...this.states].some((state) => !state.isDeterministic());
    }

    toJSON(): Object {
        return {
            title: this.title,
            description: this.description,
            circleRadius: StateGraphic.circleRadius,
            startState: this.start?.id,
            finalStates: [...this.finals].map((s) => s.id),
            states: [...this.states],
        };
    }
}
