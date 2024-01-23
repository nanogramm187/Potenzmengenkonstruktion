import { Configuration } from "./configuration";
import { Turingmachine } from "./turingmachine";

export class ConfigurationList {
    private tm: Turingmachine;
    private startConfiguration: Configuration | undefined
    private history: Configuration[][] = [];

    get configurations(): Configuration[] {
        const length = this.history.length
        let lastElement: Configuration[] = []

        if (length > 0) {
            lastElement = this.history[length - 1];
        }
        
        return lastElement;
    }

    set configurations(config: Configuration[]) {
        this.history.push(config);
    }

    constructor(tm: Turingmachine) {
        this.tm = tm;
        const startConfig = this.tm.startConfiguration('');
        if (startConfig) {
            this.startConfiguration = startConfig
            this.configurations = [this.startConfiguration];
        }
    }

    hasPreviousStep(): boolean {
        return this.history.length > 1;
    }

    previousStep() {
        if (this.hasPreviousStep()) {
            this.history.pop()
        }
    }

    hasNextStep(): boolean {
        return this.configurations.some((config) => !config.isAccepting && config.move().length > 0 );
    }

    skipToEnd() {
        while (this.hasNextStep()) {
            this.nextStep();
        }
    }

    nextStep() {
        this.configurations = this.configurations.flatMap((config) => config.move());
    }

    reset(word: string) {
        this.startConfiguration = this.tm.startConfiguration(word);

        if (this.startConfiguration == undefined) {
            this.history = [];
            return;
        }

        this.history = [[this.startConfiguration]];
    }
}