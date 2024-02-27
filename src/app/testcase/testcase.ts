import { EndlicherAutomat } from "../endlicherautomat/EndlicherAutomat";

export class Testcase {

    input: string = "";

    constructor(public automat: EndlicherAutomat) {
        this.input = "";
    }

    isAccepting(): boolean {
        return this.automat.isAcceptingWord(this.input).isAccepting!;;
    }

    toJSON(): Object {
        return {
            input: this.input
        };
    }
}