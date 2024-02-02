import { State } from "../../../statemachine/src/lib/statemachine/state";
import { Transition } from "../../../statemachine/src/lib/statemachine/stateconnections/Transition";
import { EndlicherAutomat } from "./EndlicherAutomat";
import { EndlicheTransition } from "./EndlicheTransition";

export class EndlicherState extends State {
    
    override makeTransition(destination: State): Transition {
        return new EndlicheTransition(this, destination);
    }

    override isDeterministic(): boolean {
        const counter = new Map<string, number>();

        for (const transition of this.transitions) {
            const concreteTransition = transition as EndlicheTransition;
            const transitionSymbols = concreteTransition.transitionSymbols;

            if (transitionSymbols.includes(EndlicherAutomat.epsilon)) {
                return false;
            }

            const set = new Set(concreteTransition.transitionSymbols);

            for (const symbol of set) {
                const currentCount = counter.get(symbol) ?? 1;

                if (currentCount > 1) {
                    return false;
                }

                counter.set(symbol, currentCount + 1);
            }
        }

        return true;
    }
}