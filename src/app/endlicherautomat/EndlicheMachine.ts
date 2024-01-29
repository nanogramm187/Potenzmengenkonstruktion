import { Point } from "../../../statemachine/src/lib/statemachine/drawingprimitives/Point";
import { State } from "../../../statemachine/src/lib/statemachine/state";
import { StateMachine } from "../../../statemachine/src/lib/statemachine/statemachine";
import { EndlicherState } from "./EndlicherState";

export class EndlicheMachine extends StateMachine {
    override makeState(x: number, y: number, id: number): State {
        return new EndlicherState(new Point(x, y), id);
    }
}