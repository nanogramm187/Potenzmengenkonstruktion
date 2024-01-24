import { Point } from "../statemachine/drawingprimitives/Point";
import { State } from "../statemachine/state";
import { Transition } from "../statemachine/stateconnections/Transition";
import { StateMachine } from "../statemachine/statemachine";
import { MockState } from "./MockState";

export class MockStateMachine extends StateMachine {

    private startState?: MockState

    private allStates: Set<MockState> = new Set();

    private finalStates: Set<MockState> = new Set();

    override getAllStates(): MockState[] {
        return [...this.allStates];
    }

    override getAllTransitions(): Transition[] {
        return [];
    }

    override addState(x: number, y: number): MockState {

        const newState = new MockState(new Point(x, y))

        if (this.startState == undefined) {
            this.startState = newState;
        }

        this.allStates = new Set([...this.allStates, newState]);

        console.log(newState);

        return newState;
    }

    override deleteState(state: State): void {
        
    }

    override isStartState(state: State): boolean {
        return state === this.startState;
    }

    override isFinalState(state: State): boolean {
        return this.finalStates.has(state);
    }

    override addTransition(source: State, destination: State): Transition {
        throw new Error("Method not implemented.");
    }

    override addDummyTransition(source: State, destination: State): Transition {
        throw new Error("Method not implemented.");
    }

    override getTransition(source: State, destination: State): Transition {
        throw new Error("Method not implemented.");
    }

    override deleteTransition(transition: Transition): void {
        throw new Error("Method not implemented.");
    }
}