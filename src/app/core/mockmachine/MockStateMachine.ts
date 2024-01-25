import { Point } from "../statemachine/drawingprimitives/Point";
import { State } from "../statemachine/state";
import { Transition } from "../statemachine/stateconnections/Transition";
import { StateMachine } from "../statemachine/statemachine";
import { MockState } from "./MockState";
import { MockTransition } from "./MockTransition";

export class MockStateMachine extends StateMachine {

    override makeState(x: number, y: number): State {
        return new MockState(new Point(x, y));
    }
    
    override makeTransition(source: State, destination: State): Transition {
        return new MockTransition(source, destination);
    }
}