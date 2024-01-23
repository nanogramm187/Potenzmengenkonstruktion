import { StateMachine } from "../statemachine";
import { State } from "../state";
import { BidirectionalStateConnection } from "./BidirectionalStateConnection";
import { SelfStateConnection } from "./SelfStateConnection";
import { StateConnection } from "./StateConnection";
import { UnidirectionalStateConnection } from "./UnidirectionalStateConnection";

export class StateConnectionFactory {
    static makeStateConnections(statemachine: StateMachine): StateConnection[] {
        let result: StateConnection[] = [];
        for (const state1 of statemachine.states) {
            for (const state2 of statemachine.states) {
                const stateconnection = this.make(state1, state2);
                if (stateconnection) {
                    result.push(stateconnection);
                }
            }
        }
        return result;
    }

    static make(source: State, destination: State): StateConnection | undefined {
        if (source.hasConnectionTo(destination)) {
            if (source === destination) {
                return new SelfStateConnection(source, destination);
            } else if (destination.hasConnectionTo(source)) {
                return new BidirectionalStateConnection(source, destination);
            }
            return new UnidirectionalStateConnection(source, destination);
        }
        return undefined;
    }
}