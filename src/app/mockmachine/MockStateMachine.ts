import { Point } from "../../../statemachine/src/lib/statemachine/drawingprimitives/Point";
import { State } from "../../../statemachine/src/lib/statemachine/state";
import { StateMachine } from "../../../statemachine/src/lib/statemachine/statemachine";
import { MockState } from "./MockState";

export class MockStateMachine extends StateMachine {
    override makeState(x: number, y: number, id: number): State {
        return new MockState(new Point(x, y), id);
    }
}