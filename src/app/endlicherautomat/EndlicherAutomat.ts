import { Result } from '../../../statemachine/src/lib/statemachine/Result';
import { Point } from '../../../statemachine/src/lib/statemachine/drawingprimitives/Point';
import { StateMachine } from '../../../statemachine/src/lib/statemachine/statemachine';
import { InputTable } from '../inputTable/inputTable';
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

  /*
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
  }*/

  positiveTestcases: InputTable[] = [];
  negativeTestcases: InputTable[] = [];

  static epsilon = 'ε';

  // Method to construct a DFA from this automaton
  constructDFA(): EndlicherAutomat {
    const dfa = new EndlicherAutomat();

    // Determine the start state of the DFA (epsilon closure of the NFA start state)
    const startStateSet = new Set<EndlicherState>([
      this.startState as EndlicherState,
    ]);
    const startStateClosure = EndlicherState.eClosure2(startStateSet);
    const startStateClosureSet = new Set(startStateClosure);

    // Create a map to track state combinations in the DFA
    const dfaStateMap = new Map<string, Set<EndlicherState>>();
    const startStateKey = this.getStateKey(Array.from(startStateClosureSet));
    dfaStateMap.set(startStateKey, startStateClosureSet);

    // Create the start state for the DFA
    const startDFAState = new EndlicherState(new Point(0, 0), 0);
    startDFAState.name = startStateKey; // Name des Startzustands setzen
    dfa.startState = startDFAState;
    dfa.allStates.push(startDFAState);

    // Check if the start state is a final state
    if (this.containsFinalState(startStateClosureSet)) {
      dfa.finalStates.add(startDFAState);
    }

    // Process state combinations
    const unprocessedStates: Set<EndlicherState>[] = [startStateClosureSet];

    while (unprocessedStates.length > 0) {
      const currentNFAStates = unprocessedStates.pop()!;
      const currentStateKey = this.getStateKey(Array.from(currentNFAStates));

      // Check if this state already exists in the DFA
      let currentDFAState: EndlicherState | undefined = dfa.allStates.find(
        (s) => s.name === currentStateKey
      ) as EndlicherState;

      // If the state does not exist, create it
      if (!currentDFAState) {
        currentDFAState = new EndlicherState(new Point(0, 0), 0); // Erstelle einen neuen EndlicherState
        currentDFAState.name = currentStateKey;
        dfa.allStates.push(currentDFAState);

        // Check if the current state contains a final state
        if (this.containsFinalState(currentNFAStates)) {
          dfa.finalStates.add(currentDFAState); // Markiere den DFA-Zustand als final
        }
      }

      // Calculate possible transitions for each input symbol
      const symbols = this.getAllTransitionSymbols();

      for (const symbol of symbols) {
        // Calculate new NFA states for this symbol
        const nextNFAStates = EndlicherState.move2(
          Array.from(currentNFAStates),
          symbol
        );
        const nextNFAStateClosure = new Set(
          EndlicherState.eClosure2(new Set(nextNFAStates))
        );

        const nextStateKey = this.getStateKey(Array.from(nextNFAStateClosure));

        // Find the next DFA state or create it if it doesn't exist
        let nextDFAState: EndlicherState | undefined = dfa.allStates.find(
          (s) => s.name === nextStateKey
        ) as EndlicherState;

        if (!nextDFAState) {
          nextDFAState = new EndlicherState(new Point(0, 0), 0); // Neuer Zustand
          nextDFAState.name = nextStateKey;
          dfa.allStates.push(nextDFAState);

          // Check if this new state is final
          if (this.containsFinalState(nextNFAStateClosure)) {
            dfa.finalStates.add(nextDFAState); // Markiere den Zustand als final
          }
        }

        // Check if the transition already exists
        let existingTransition = currentDFAState.transitions.find(
          (transition) => transition.destination === nextDFAState
        );

        if (existingTransition) {
          // Add the symbol to the existing transition if not already included
          if (!existingTransition.transitionSymbols.includes(symbol)) {
            existingTransition.transitionSymbols.push(symbol);
          }
        } else {
          // Create a new transition if it does not exist
          const transition = new EndlicheTransition(
            currentDFAState,
            nextDFAState
          );
          transition.transitionSymbols.push(symbol);
          currentDFAState.transitions.push(transition);
        }

        // If this state combination hasn't been processed yet, add it to the list
        if (!dfaStateMap.has(nextStateKey)) {
          dfaStateMap.set(nextStateKey, nextNFAStateClosure);
          unprocessedStates.push(nextNFAStateClosure);
        }
      }
    }

    // Return the complete DFA
    return dfa;
  }

  // Check if any of the given states are final states
  containsFinalState(states: Set<EndlicherState>): boolean {
    return Array.from(states).some((state) => this.finalStates.has(state));
  }

  // Generate a table representing the DFA's states and transitions
  generateDFATable(): string[][] {
    const dfaTable: string[][] = [];
    const dfa = this.constructDFA();
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
      if (dfa.isStartState(dfaState)) {
        stateName += ', (A)';
      }
      if (dfa.isFinalState(dfaState)) {
        stateName += ', (E)';
      }

      row.push(stateName); // Add to the row

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

        const stateList = Array.from(destinationStates).join(', ');

        // If stateList is empty, replace with ∅
        row.push(stateList !== '' ? stateList : '∅');
      }

      // Empty Columns wont be added
      if (row[0] !== '' && !row.slice(1).every((cell) => cell === '∅')) {
        dfaTable.push(row);
      }
    }
    return dfaTable;
  }

  // Create a unique key for a set of states
  private getStateKey(states: EndlicherState[]): string {
    return states
      .map((state) => state.name)
      .sort()
      .join(', ');
  }

  // Get all unique transition symbols from all states in the DFA
  private getAllTransitionSymbols(): string[] {
    const symbols = new Set<string>();
    for (const state of this.allStates) {
      for (const transition of (state as EndlicherState).transitions) {
        transition.transitionSymbols.forEach((symbol) => symbols.add(symbol));
      }
    }
    return Array.from(symbols);
  }

  // Get unique transition symbols used in the DFA
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

  // Returns an array of unique state names from all states
  get automataStates(): string[] {
    const stateSet = new Set<string>();

    this.getAllStates().forEach((state) => {
      state.name.split(',').forEach((name) => {
        stateSet.add(name.trim());
      });
    });

    return Array.from(stateSet);
  }

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
      const newTestcase = new InputTable(automata);
      newTestcase.input = testcase.input;
      automata.positiveTestcases.push(newTestcase);
    }

    for (const testcase of object.negativeTestcases) {
      const newTestcase = new InputTable(automata);
      newTestcase.input = testcase.input;
      automata.negativeTestcases.push(newTestcase);
    }

    automata.title = object.title;
    automata.description = object.description;

    return automata;
  }
}
