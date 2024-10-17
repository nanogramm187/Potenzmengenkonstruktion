import { Result } from '../../../statemachine/src/lib/statemachine/Result';
import { Point } from '../../../statemachine/src/lib/statemachine/drawingprimitives/Point';
import { StateMachine } from '../../../statemachine/src/lib/statemachine/statemachine';
import { Testcase } from '../testcase/testcase';
import { EndlicheTransition } from './EndlicheTransition';
import { EndlicherState } from './EndlicherState';

export class EndlicherAutomat extends StateMachine {
  public dfa?: EndlicherAutomat;

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

  static epsilon = 'ε';

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
    localStorage.setItem('endlicherautomat', JSON.stringify(this.toJSON()));
  }

  override createInstanceFromJSON(object: any): StateMachine {
    this.dfa = this.constructDFA(object);
    return this.fromJSON(object);
  }

  constructDFA(object: any): EndlicherAutomat {
    const nfa = this.fromJSON(object); // NFA laden
    const dfa = new EndlicherAutomat(); // Neuer Automat für den DFA

    // 1. Bestimme den Startzustand des DFA (epsilon-Hülle des Startzustands des NFA)
    const startStateSet = new Set<EndlicherState>([
      nfa.startState as EndlicherState,
    ]);
    const startStateClosure = EndlicherState.eClosure2(startStateSet);

    // 2. Erstelle eine Map zur Verfolgung der Zustandskombinationen im DFA
    const dfaStateMap = new Map<string, Set<EndlicherState>>();
    const startStateKey = this.getStateKey(startStateClosure);
    dfaStateMap.set(startStateKey, new Set(startStateClosure));

    // Erstelle den Startzustand für den DFA
    const startDFAState = new EndlicherState(new Point(0, 0), 0);
    startDFAState.name = startStateKey; // Name des Startzustands setzen
    dfa.startState = startDFAState;
    dfa.allStates.push(startDFAState);

    // 3. Verarbeite die Zustandskombinationen
    const unprocessedStates: Set<EndlicherState>[] = [
      new Set(startStateClosure),
    ];

    while (unprocessedStates.length > 0) {
      const currentNFAStates = unprocessedStates.pop()!;
      const currentStateKey = this.getStateKey(Array.from(currentNFAStates));

      // Falls dieser Zustand noch nicht im DFA ist, füge ihn hinzu
      let currentDFAState: EndlicherState | undefined = dfa.allStates.find(
        (s) => s.name === currentStateKey
      ) as EndlicherState; // Hier wird der Zustand als EndlicherState behandelt

      if (!currentDFAState) {
        currentDFAState = new EndlicherState(new Point(0, 0), 0); // Erstelle einen neuen EndlicherState
        currentDFAState.name = currentStateKey;
        dfa.allStates.push(currentDFAState);
      }

      // Berechne die möglichen Übergänge für jedes Eingabesymbol
      const symbols = this.getAllTransitionSymbols(nfa);

      for (const symbol of symbols) {
        // Berechne die neuen Zustände bei diesem Symbol
        const nextNFAStates = EndlicherState.move2(
          Array.from(currentNFAStates),
          symbol
        );
        const nextNFAStateClosure = new Set(
          EndlicherState.eClosure2(nextNFAStates)
        );

        const nextStateKey = this.getStateKey(Array.from(nextNFAStateClosure));

        // Finde den Zielzustand im DFA oder erstelle ihn, falls er noch nicht existiert
        let nextDFAState: EndlicherState | undefined = dfa.allStates.find(
          (s) => s.name === nextStateKey
        ) as EndlicherState; // Typumwandlung von State zu EndlicherState

        if (!nextDFAState) {
          nextDFAState = new EndlicherState(new Point(0, 0), 0); // Falls der Zustand noch nicht existiert, erstelle einen neuen EndlicherState
          nextDFAState.name = nextStateKey;
          dfa.allStates.push(nextDFAState); // Füge den neuen Zustand zur Liste hinzu
        }

        // Füge die Transition vom aktuellen Zustand zu den nächsten Zuständen hinzu
        const transition = new EndlicheTransition(
          currentDFAState,
          nextDFAState
        );
        transition.transitionSymbols.push(symbol);
        currentDFAState.transitions.push(transition);

        // Falls diese Zustandskombination noch nicht verarbeitet wurde, füge sie zur Liste hinzu
        if (!dfaStateMap.has(nextStateKey)) {
          dfaStateMap.set(nextStateKey, nextNFAStateClosure);
          unprocessedStates.push(nextNFAStateClosure);
        }
      }
    }

    // 4. Rückgabe des vollständigen DFA
    return dfa;
  }

  private getStateKey(states: EndlicherState[]): string {
    return states
      .map((state) => state.name)
      .sort()
      .join(',');
  }

  private getAllTransitionSymbols(nfa: EndlicherAutomat): string[] {
    const symbols = new Set<string>();
    for (const state of nfa.allStates) {
      for (const transition of (state as EndlicherState).transitions) {
        transition.transitionSymbols.forEach((symbol) => symbols.add(symbol));
      }
    }
    return Array.from(symbols);
  }

  get uniqueTransitionSymbols(): string[] {
    const symbolSet = new Set<string>();
    this.getAllTransitions().forEach((transition) => {
      transition.labels().forEach((label) => {
        const symbols = label.text.split(',');
        symbols.forEach((symbol) => symbolSet.add(symbol.trim()));
      });
    });

    return Array.from(symbolSet);
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
      negativeTestcases: this.negativeTestcases,
    };
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
      const newState = automata.makeState(
        state.origin.x,
        state.origin.y,
        state.id
      );
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
        const newTransition = state.addTransition(
          destination
        ) as EndlicheTransition;
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
