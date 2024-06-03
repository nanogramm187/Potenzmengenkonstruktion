import { Result } from "../../../statemachine/src/lib/statemachine/Result";
import { Point } from "../../../statemachine/src/lib/statemachine/drawingprimitives/Point";
import { StateMachine } from "../../../statemachine/src/lib/statemachine/statemachine";
import { Testcase } from "../testcase/testcase";
import { EndlicheTransition } from "./EndlicheTransition";
import { EndlicherState } from "./EndlicherState";

export class EndlicherAutomat extends StateMachine {

    set input(input: string) {
        this._input = input;
    }

    get input(): string {
        return this._input.substring(0, this.splitPosition);
    }
    
    splitPosition = 0;

    skipToEnd() {
        this.splitPosition = this._input.length;
    }

    nextStep() {
        if (this.splitPosition < this._input.length) {
            this.splitPosition += 1;
        }
    }

    previousStep() {
        if (this.splitPosition > 0) {
            this.splitPosition -= 1;
        }
    }

    reset() {
    this.splitPosition = 0;
    }

    hasPreviousStep(): boolean {
    return this.splitPosition > 0;
    }

    hasNextStep(): boolean {
    return this.splitPosition < this._input.length;
    }

    positiveTestcases: Testcase[] = [];
    negativeTestcases: Testcase[] = [];

    static epsilon = "ε";

    override makeState(x: number, y: number, id: number): EndlicherState {
        return new EndlicherState(new Point(x, y), id);
    }

    override isAcceptingWord(word: string): Result {
        const finals = this.finalStates as Set<EndlicherState>;
        const start = this.startState as EndlicherState;

        if (start == undefined) {
            return new Result([], false);
        }

        let states = start.eClosure();

        for (const token of [...word]) {
            if (states.length == 0) {
                return new Result([], false);
            }
            states = EndlicherState.eClosure2(EndlicherState.move2(states, token));
        }

        for (const state of states) {
            if (finals.has(state)) {
                return new Result(states, true);
            }
        }

        return new Result(states, false);
    }

    override createNewInstance(): StateMachine {
        const newInstance = new EndlicherAutomat();
        return newInstance;
    }

    override loadFromBrowserCache(): StateMachine {
        const json = JSON.parse(localStorage.getItem('endlicherautomat') as string);
        return this.createInstanceFromJSON(json);
    }

    override saveToBrowserCache(): void {
        localStorage.setItem(
            'endlicherautomat',
            JSON.stringify(this.toJSON())
        );
    }

    override createInstanceFromJSON(object: any): StateMachine {
        return this.fromJSON(object);
    }

    override saveToLocalStorage(): void {
        const a = document.createElement('a');
        const file = new Blob([JSON.stringify(this.toJSON())], {
            type: 'text/json',
        });
        a.href = URL.createObjectURL(file);
        if (this.title != '') {
            a.download = this.title + '.json';
        } else {
            a.download = 'endlicherautomat.json';
        }
        a.click();
    }

    private toJSON(): Object {
        return {
            title: this.title,
            description: this.description,
            startState: this.startState?.id,
            finalStates: [...this.finalStates].map((state) => state.id),
            states: this.allStates,
            positiveTestcases: this.positiveTestcases,
            negativeTestcases: this.negativeTestcases
        }
    }

    private fromJSON(object: any): EndlicherAutomat {
        const automata = new EndlicherAutomat();

        const states = new Map<number, EndlicherState>();
        const finalStates = new Set<number>();

        for (const finalStateID of object.finalStates) {
            finalStates.add(finalStateID);
        }

        // Create all states
        for (const state of object.states) {
            const newState = automata.makeState(state.origin.x, state.origin.y, state.id)
            newState.name = state.name;
            automata.allStates.push(newState);
            states.set(state.id, newState);
        }

        for (const jsonState of object.states) {
            const state = states.get(jsonState.id);

            if (state == undefined) {
                continue;
            }

            // Set start state
            if (state.id == object.startState) {
                automata.startState = states.get(state.id);
            }

            // Set final states
            if (finalStates.has(state.id)) {
                const finalState = states.get(state.id);
                if (finalState != undefined) {
                    automata.finalStates.add(finalState);
                }
            }

            // Add transitions
            for (const transition of jsonState.transitions) {
                const destination = states.get(transition.destination)!;
                const newTransition = state.addTransition(destination) as EndlicheTransition;
                newTransition.transitionSymbols = transition.transitionSymbols;
            }
        }
    
        // Add testcases
        for (const testcase of object.positiveTestcases) {
            const newTestcase = new Testcase(automata);
            newTestcase.input = testcase.input;
            automata.positiveTestcases.push(newTestcase);
        }

        for (const testcase of object.negativeTestcases) {
            const newTestcase = new Testcase(automata);
            newTestcase.input = testcase.input;
            automata.negativeTestcases.push(newTestcase);
        }

        automata.title = object.title;
        automata.description = object.description;

        return automata;
    }
}