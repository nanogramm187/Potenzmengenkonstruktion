import { State } from "../../../statemachine/src/lib/statemachine/state";
import { Transition } from "../../../statemachine/src/lib/statemachine/stateconnections/Transition";
import { EndlicherAutomat } from "./EndlicherAutomat";
import { EndlicheTransition } from "./EndlicheTransition";

export class EndlicherState extends State {

    override transitions: EndlicheTransition[] = []
    
    override makeTransition(destination: EndlicherState): Transition {
        return new EndlicheTransition(this, destination);
    }

    override isDeterministic(): boolean {
        const counter = new Map<string, number>();

        for (const transition of this.transitions) {
            const transitionSymbols = transition.transitionSymbols;

            if (transitionSymbols.includes(EndlicherAutomat.epsilon)) {
                return false;
            }

            const set = new Set(transition.transitionSymbols);

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

    private move(c: string): EndlicherState[] {
        return this.transitions
        .filter((transition) => transition.includesSymbol(c))
        .map((transition) => transition.destination)
    }

    private eClosure(s: EndlicherState): EndlicherState[] {
        let result = [s];
        let index = 0;
        while (index < result.length) {
            let newElements = result[index].move('ε');
            for (const element of newElements) {
                if (!result.includes(element)) {
                    result.push(element);
                }
            }
            index = index + 1;
        }
        return result;
    }
}