import { State } from "./state";
import { Transition } from "./stateconnections/Transition";

export abstract class StateMachine {

    abstract getAllStates(): State[];

    abstract getAllTransitions(): Transition[];
   
    abstract addState(x: number, y: number): State;

    abstract deleteState(state: State): void;

    abstract isStartState(state: State): boolean;

    abstract isFinalState(state: State): boolean;

    abstract addTransition(source: State, destination: State): Transition;

    abstract addDummyTransition(source: State, destination: State): Transition;

    abstract getTransition(source: State, destination: State): Transition;

    abstract deleteTransition(transition: Transition): void;

    isDeterministic(): boolean {
        return ![...this.getAllStates()].some((state) => !state.isDeterministic);
    }
}
