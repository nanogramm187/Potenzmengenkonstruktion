import { Turingmachine } from './turingmachine';

export class Testcase {
  private tmaschine: Turingmachine;
  leftHandSide: string;
  rightHandSide: string;
  position: number | undefined;

  accepting(): boolean {
    return this.tmaschine.accepting(this.leftHandSide).some((config) => {
      if (!config.isAccepting) {
        return false;
      }

      if (
        this.position != undefined &&
        config.tapecontent.headIndex != this.position
      ) {
        return false;
      }

      const tapeContent = config.tapecontent.contentStartingFromHead;
      if (tapeContent.length < this.rightHandSide.length) {
        return (
          this.rightHandSide ==
          tapeContent.padEnd(this.rightHandSide.length, '#')
        );
      }

      return tapeContent == this.rightHandSide.padEnd(tapeContent.length, '#');
    });
  }

  constructor(tmaschine: Turingmachine) {
    this.tmaschine = tmaschine;
    this.leftHandSide = '';
    this.rightHandSide = '';
  }

  toJSON(): Object {
    return {
      leftHandSide: this.leftHandSide,
      rightHandSide: this.rightHandSide,
      position: this.position,
    };
  }
}
