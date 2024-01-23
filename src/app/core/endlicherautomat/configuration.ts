import { Tapecontent } from "./tapecontent";
import { TuringState } from "./turingstate";
import { Direction } from "./turingedges";
import { Turingmachine } from "./turingmachine";

export class Configuration {
    state: TuringState;
    tapecontent: Tapecontent;
    private turingMachine: Turingmachine;

    get isAccepting(): boolean {
        return this.turingMachine.finals.has(this.state);
    }

    constructor(
        state: TuringState,
        tapecontent: Tapecontent,
        turingMachine: Turingmachine,
    ) {
        this.state = state;
        this.tapecontent = tapecontent;
        this.turingMachine = turingMachine;
    }

    public move(): Configuration[] {
        // get the next token from the word iterator
        let token = this.tapecontent.headSymbol;
        
        let edges = this.state.edges.getTransitions(token);

        let newConfigurations: Configuration[] = [];

        for (const edge of edges) {
            // create a new configuration for each transition
            let newConfiguration = this.copy();

            // set the new state
            newConfiguration.state = edge.dstState;

            // write the new symbol on the tape
            newConfiguration.tapecontent.headSymbol = edge.writeSymbol;

            // move the head of the tape
            if (edge.direction == Direction.Left) {
                newConfiguration.tapecontent.moveHeadLeft();
            } else if (edge.direction == Direction.Right) {
                newConfiguration.tapecontent.moveHeadRight();
            }

            newConfigurations.push(newConfiguration);
        }

        return newConfigurations;
    }

    copy(): Configuration {
        const tapecontent = this.tapecontent.copy();
        return new Configuration(this.state, tapecontent, this.turingMachine);
    }
}