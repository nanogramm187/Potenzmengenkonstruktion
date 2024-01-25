import { Point } from "../../../statemachine/src/lib/statemachine/drawingprimitives/Point";
import { State } from "../../../statemachine/src/lib/statemachine/state";
import { Transition } from "../../../statemachine/src/lib/statemachine/stateconnections/Transition";
import { StateMachine } from "../../../statemachine/src/lib/statemachine/statemachine";
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