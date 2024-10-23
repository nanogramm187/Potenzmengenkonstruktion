import { Result } from '../../../statemachine/src/lib/statemachine/Result';
import { Point } from '../../../statemachine/src/lib/statemachine/drawingprimitives/Point';
import { StateMachine } from '../../../statemachine/src/lib/statemachine/statemachine';
import { Testcase } from '../testcase/testcase';
import { EndlicheTransition } from './EndlicheTransition';
import { EndlicherState } from './EndlicherState';

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
    return this.fromJSON(object);
  }

  constructDFA(): EndlicherAutomat {
    const dfa = new EndlicherAutomat(); // Neuer Automat für den DFA

    // 1. Bestimme den Startzustand des DFA (epsilon-Hülle des Startzustands des NFA)
    const startStateSet = new Set<EndlicherState>([
      this.startState as EndlicherState,
    ]);
    const startStateClosure = EndlicherState.eClosure2(startStateSet);

    // Konvertiere das Ergebnis von eClosure2 (Array) in ein Set
    const startStateClosureSet = new Set(startStateClosure);

    // 2. Erstelle eine Map zur Verfolgung der Zustandskombinationen im DFA
    const dfaStateMap = new Map<string, Set<EndlicherState>>();
    const startStateKey = this.getStateKey(Array.from(startStateClosureSet));
    dfaStateMap.set(startStateKey, startStateClosureSet);

    // Erstelle den Startzustand für den DFA
    const startDFAState = new EndlicherState(new Point(0, 0), 0);
    startDFAState.name = startStateKey; // Name des Startzustands setzen
    dfa.startState = startDFAState;
    dfa.allStates.push(startDFAState);

    // Überprüfe, ob der Startzustand einen Endzustand enthält
    if (this.containsFinalState(startStateClosureSet)) {
      dfa.finalStates.add(startDFAState);
    }

    // 3. Verarbeite die Zustandskombinationen
    const unprocessedStates: Set<EndlicherState>[] = [startStateClosureSet];

    while (unprocessedStates.length > 0) {
      const currentNFAStates = unprocessedStates.pop()!;
      const currentStateKey = this.getStateKey(Array.from(currentNFAStates));

      // Falls dieser Zustand noch nicht im DFA ist, füge ihn hinzu
      let currentDFAState: EndlicherState | undefined = dfa.allStates.find(
        (s) => s.name === currentStateKey
      ) as EndlicherState;

      if (!currentDFAState) {
        currentDFAState = new EndlicherState(new Point(0, 0), 0); // Erstelle einen neuen EndlicherState
        currentDFAState.name = currentStateKey;
        dfa.allStates.push(currentDFAState);

        // Überprüfe, ob dieser Zustand einen Endzustand enthält
        if (this.containsFinalState(currentNFAStates)) {
          dfa.finalStates.add(currentDFAState); // Markiere den DFA-Zustand als final
        }
      }

      // Berechne die möglichen Übergänge für jedes Eingabesymbol
      const symbols = this.getAllTransitionSymbols();

      for (const symbol of symbols) {
        // Berechne die neuen Zustände bei diesem Symbol
        const nextNFAStates = EndlicherState.move2(
          Array.from(currentNFAStates),
          symbol
        );
        const nextNFAStateClosure = new Set(
          EndlicherState.eClosure2(new Set(nextNFAStates))
        );

        const nextStateKey = this.getStateKey(Array.from(nextNFAStateClosure));

        // Finde den Zielzustand im DFA oder erstelle ihn, falls er noch nicht existiert
        let nextDFAState: EndlicherState | undefined = dfa.allStates.find(
          (s) => s.name === nextStateKey
        ) as EndlicherState;

        if (!nextDFAState) {
          nextDFAState = new EndlicherState(new Point(0, 0), 0); // Neuer Zustand
          nextDFAState.name = nextStateKey;
          dfa.allStates.push(nextDFAState);

          // Überprüfe, ob der nächste Zustand einen Endzustand enthält
          if (this.containsFinalState(nextNFAStateClosure)) {
            dfa.finalStates.add(nextDFAState); // Markiere den Zustand als final
          }
        }

        // Überprüfen, ob die Transition bereits existiert
        let existingTransition = currentDFAState.transitions.find(
          (transition) => transition.destination === nextDFAState
        );

        if (existingTransition) {
          // Füge das Symbol zur existierenden Transition hinzu, falls es noch nicht vorhanden ist
          if (!existingTransition.transitionSymbols.includes(symbol)) {
            existingTransition.transitionSymbols.push(symbol);
          }
        } else {
          // Füge die Transition vom aktuellen Zustand zu den nächsten Zuständen hinzu
          const transition = new EndlicheTransition(
            currentDFAState,
            nextDFAState
          );
          transition.transitionSymbols.push(symbol); // Füge Symbol zur neuen Transition hinzu
          currentDFAState.transitions.push(transition); // Füge die neue Transition zur Liste hinzu
        }

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

  // Hilfsfunktion zur Überprüfung, ob eine Menge von NFA-Zuständen einen Endzustand enthält
  containsFinalState(states: Set<EndlicherState>): boolean {
    for (const state of states) {
      if (this.finalStates.has(state)) {
        return true;
      }
    }
    return false;
  }

  getAllFinalStates(): EndlicherState[] {
    // Return an array of all final states
    return Array.from(this.finalStates) as EndlicherState[];
  }

  generateDFATable(): string[][] {
    const dfaTable: string[][] = [];
    const dfa = this.constructDFA(); // Call constructDFA once and store the result
    const dfaStates = dfa.getAllStates();
    const transitionSymbols = dfa.getAllTransitionSymbols();

    // Add the header row
    const headerRow = ['SDFA', ...transitionSymbols];
    dfaTable.push(headerRow);

    // Iterate through each DFA state
    for (const dfaState of dfaStates) {
      const row: string[] = [];

      // Check if the state is a start state or an end state
      let stateName = dfaState.name;

      // Append (A) for start state
      if (dfa.isStartState(dfaState)) {
        stateName += ', (A)'; // Check if this state is a start state
      }

      // Append (E) for end state
      if (dfa.isFinalState(dfaState)) {
        stateName += ', (E)'; // Check if this state is an end state
      }

      row.push(stateName); // Add the modified state name to the row

      // For each transition symbol, find the destination states
      for (const symbol of transitionSymbols) {
        const destinationStates = new Set(
          dfaState.transitions
            .filter(
              (transition): transition is EndlicheTransition =>
                transition instanceof EndlicheTransition &&
                transition.includesSymbol(symbol)
            )
            .map((transition) => transition.destination.name) // Assuming 'destination' refers to the target state
        );

        // If the destination states set is empty, add "∅"
        const stateList = Array.from(destinationStates).join(', ');

        // Check if stateList is an empty string and replace it with ∅
        row.push(stateList !== '' ? stateList : '∅');
      }

      const firstColumnIsEmpty = row[0] === '';
      const allOtherColumnsAreEmptySets = row
        .slice(1)
        .every((cell) => cell === '∅');

      if (!firstColumnIsEmpty && !allOtherColumnsAreEmptySets) {
        dfaTable.push(row); // Add the row only if it doesn't meet the discard criteria
      }
    }
    return dfaTable;
  }

  private getStateKey(states: EndlicherState[]): string {
    return states
      .map((state) => state.name)
      .sort()
      .join(', ');
  }

  private getAllTransitionSymbols(): string[] {
    const symbols = new Set<string>();
    for (const state of this.allStates) {
      for (const transition of (state as EndlicherState).transitions) {
        transition.transitionSymbols.forEach((symbol) => symbols.add(symbol));
      }
    }
    return Array.from(symbols);
  }

  get uniqueTransitionSymbols(): string[] {
    const symbolSet = new Set<string>();
    this.constructDFA()
      .getAllTransitions()
      .forEach((transition) => {
        transition.labels().forEach((label) => {
          const symbols = label.text.split(',');
          symbols.forEach((symbol) => symbolSet.add(symbol.trim()));
        });
      });

    return Array.from(symbolSet);
  }

  get dfaZustaende(): string[] {
    const stateSet = new Set<string>();

    this.getAllStates().forEach((state) => {
      state.name.split(',').forEach((name) => {
        stateSet.add(name.trim());
      });
    });

    return Array.from(stateSet); // Convert the Set back to an array
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
