import { transition } from "@angular/animations";
import { State } from "./state";
import { Transition } from "./stateconnections/Transition";

export abstract class StateMachine {

    protected startState?: State

    protected allStates: Set<State> = new Set();

    protected finalStates: Set<State> = new Set();

    abstract makeState(x: number, y: number): State;

    abstract makeTransition(source: State, destination: State): Transition;

    getAllStates(): State[] {
        return [...this.allStates];
    }

    getAllTransitions(): Transition[] {
        return [...this.allStates].flatMap((state) => [...state.transitions]);
    }

    addState(x: number, y: number): State {
        const newState = this.makeState(x, y)

        if (this.startState == undefined) {
            this.startState = newState;
        }

        newState.id = this.makeId();
        newState.name = `q${newState.id}`;

        this.allStates = new Set([...this.allStates, newState]);

        return newState;
    }

    private makeId(): number {
        let id = 0;
        while ([...this.allStates].some((state) => state.id == id)) {
            id++;
        }
        return id;
    }

    deleteState(state: State): void {

        // Remove start if state is start state.
        if (this.startState == state) {
            this.startState = undefined;
        }

        // Remove state from final states.
        this.finalStates.delete(state);

        // Remove transitions where 'state' is the destination state
        this.getAllTransitions().forEach((transition) => {
            if (transition.destination == state) {
                this.deleteTransition(transition);
            }
        });

        this.allStates.delete(state);
    }

    isStartState(state: State): boolean {
        return state === this.startState;
    }

    isFinalState(state: State): boolean {
        return this.finalStates.has(state);
    }

    addTransition(source: State, destination: State): Transition {
        // Check if transition already exists.
        let transition = [...source.transitions].find(
            (transition) => transition.destination == destination
        );

        // If transition does not exist, create it.
        if (transition == undefined) {
            transition = this.makeTransition(source, destination);
            source.transitions = new Set([...source.transitions, transition]);
        }

        return transition;
    }

    deleteTransition(transition: Transition): void {
        transition.source.transitions.delete(transition);
    }

    isDeterministic(): boolean {
        return ![...this.getAllStates()].some((state) => !state.isDeterministic);
    }
}
