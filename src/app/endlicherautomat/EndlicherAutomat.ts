import { Result } from '../../../statemachine/src/lib/statemachine/Result';
import { Point } from '../../../statemachine/src/lib/statemachine/drawingprimitives/Point';
import { StateMachine } from '../../../statemachine/src/lib/statemachine/statemachine';
import { InputTable } from '../inputTable/inputTable';
import { EndlicheTransition } from './EndlicheTransition';
import { EndlicherState } from './EndlicherState';
import { State } from '../../../statemachine/src/lib/statemachine/state';

export class EndlicherAutomat extends StateMachine {
  // Optional delegate for handling events or logic related to the automaton's state.
  delegate?: EndlicherAutomatDelegate;

  set input(input: string) {
    this._input = input;
  }

  get input(): string {
    return this._input.substring(0, this.splitPosition);
  }

  splitPosition = 0;

  positiveTestcases: InputTable[] = [];
  negativeTestcases: InputTable[] = [];

  static epsilon = 'ε';

  // Create a unique key for a set of states
  private getStateKey(states: EndlicherState[]): string {
    return states
      .map((state) => state.name)
      .sort()
      .join(', ');
  }

  // Check if any of the given states are final states
  containsFinalState(states: Set<EndlicherState>): boolean {
    return Array.from(states).some((state) => this.finalStates.has(state));
  }

  // Get all unique transition symbols from all states
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
  get uniqueDfaTransitionSymbols(): string[] {
    const symbolSet = new Set<string>();
    this.constructDfa()
      .getAllTransitions()
      .forEach((transition) => {
        transition.labels().forEach((label) => {
          label.text
            .split(',')
            .forEach((symbol) => symbolSet.add(symbol.trim()));
        });
      });

    return Array.from(symbolSet);
  }

  // Returns an array of unique state names from all DFA states
  get dfaStates(): string[] {
    const stateSet = new Set<string>();

    this.constructDfa()
      .getAllStates()
      .forEach((state) => {
        stateSet.add(state.name.trim());
      });
    return Array.from(stateSet);
  }

  // Returns an array of sorted unique state names from all DFA states
  get sortedDfaStates(): string[] {
    const stateSet = new Set<string>();

    this.constructDfa()
      .getAllStates()
      .forEach((state) => {
        state.name.split(',').forEach((name) => {
          stateSet.add(name.trim());
        });
      });

    // Convert the Set to an array and sort it alphabetically
    const sortedStates = Array.from(stateSet).sort((a, b) =>
      a.localeCompare(b)
    );

    return sortedStates;
  }

  // Method to construct a DFA from this automaton
  constructDfa(): EndlicherAutomat {
    const dfa = new EndlicherAutomat();
    let xPosition = 100;

    if (!this.startState) {
      return dfa;
    }

    // Create a map to track state combinations in the DFA
    const dfaStateMap = new Map<string, Set<EndlicherState>>();

    // Determine the start state of the DFA (epsilon closure of the NFA start state) and add it to the map
    const startStateClosureSet = new Set(
      EndlicherState.eClosure2(new Set([this.startState as EndlicherState]))
    );
    const startStateKey = this.getStateKey(Array.from(startStateClosureSet));
    dfaStateMap.set(startStateKey, startStateClosureSet);

    // Create the start state for the DFA
    const startDFAState = new EndlicherState(new Point(xPosition, 100), 0);
    startDFAState.name = startStateKey || '∅';
    dfa.startState = startDFAState;
    dfa.allStates.push(startDFAState);
    xPosition += 100;

    // Check if the start state is a final state
    if (this.containsFinalState(startStateClosureSet)) {
      dfa.finalStates.add(startDFAState);
    }

    // Process state combinations
    const unprocessedStates: Set<EndlicherState>[] = [startStateClosureSet];

    while (unprocessedStates.length > 0) {
      const currentNFAStates = unprocessedStates.pop()!;
      const currentStateKey = this.getStateKey(Array.from(currentNFAStates));

      // Ensure the state key is valid and only assign ∅ if truly empty
      const validStateKey = currentStateKey !== '' ? currentStateKey : '∅';

      // Check if this state already exists in the DFA
      let currentDFAState: EndlicherState | undefined = dfa.allStates.find(
        (s) => s.name === validStateKey
      ) as EndlicherState;

      // If the state does not exist, create it
      if (!currentDFAState) {
        currentDFAState = new EndlicherState(new Point(xPosition, 100), 0);
        currentDFAState.name = validStateKey;
        dfa.allStates.push(currentDFAState);
        xPosition += 100;

        // Check if the current state contains a final state
        if (this.containsFinalState(currentNFAStates)) {
          dfa.finalStates.add(currentDFAState);
        }
      }

      // Calculate possible transitions for each input symbol
      const symbols = this.getAllTransitionSymbols();

      for (const symbol of symbols) {
        // Calculate new NFA states for this symbol
        const nextNFAStateClosure = new Set(
          EndlicherState.eClosure2(
            new Set(EndlicherState.move2(Array.from(currentNFAStates), symbol))
          )
        );

        const nextStateKey = this.getStateKey(Array.from(nextNFAStateClosure));

        // Ensure the state key is valid and only assign ∅ if truly empty
        const validNextStateKey = nextStateKey !== '' ? nextStateKey : '∅';

        // Find the next DFA state or create it if it doesn't exist
        let nextDFAState: EndlicherState | undefined = dfa.allStates.find(
          (s) => s.name === validNextStateKey
        ) as EndlicherState;

        if (!nextDFAState) {
          nextDFAState = new EndlicherState(new Point(xPosition, 100), 0);
          nextDFAState.name = validNextStateKey;
          dfa.allStates.push(nextDFAState);
          xPosition += 100;

          // Check if this new state is final
          if (this.containsFinalState(nextNFAStateClosure)) {
            dfa.finalStates.add(nextDFAState);
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
        if (!dfaStateMap.has(validNextStateKey)) {
          dfaStateMap.set(validNextStateKey, nextNFAStateClosure);
          unprocessedStates.push(nextNFAStateClosure);
        }
      }
    }
    // Return the complete DFA
    return dfa;
  }

  // Generate a table representing the DFA's states and transitions
  generateDfaTable(): string[][] {
    const dfaTable: string[][] = [];
    const dfa = this.constructDfa();
    const dfaStates = dfa.getAllStates();
    const transitionSymbols = dfa.uniqueDfaTransitionSymbols;

    // Add the header row
    dfaTable.push(['SDFA', ...transitionSymbols]);

    // Iterate through each DFA state
    for (const dfaState of dfaStates) {
      const row: string[] = [];

      // Check if the state is a start state or an end state
      let stateName = dfaState.name;
      if (dfa.isStartState(dfaState)) {
        stateName += ' (A)';
      }
      if (dfa.isFinalState(dfaState)) {
        stateName += ' (E)';
      }

      row.push(stateName); // Add to the row

      // For each transition symbol, find the destination states
      for (const symbol of transitionSymbols) {
        const destinationStates = new Set<string>();
        for (const transition of dfaState.transitions) {
          if (
            transition instanceof EndlicheTransition &&
            transition.includesSymbol(symbol)
          ) {
            destinationStates.add(transition.destination.name);
          }
        }

        const stateList = Array.from(destinationStates).join(', ') || '∅'; // Use ∅ if no states found
        row.push(stateList);
      }

      // Ensure the row is added to the table, even if it only contains empty set symbols
      dfaTable.push(row);
    }

    return dfaTable;
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
    this.delegate?.onCreateNewInstanceFromJSON(newInstance);

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
    const stateMachine = this.fromJSON(object);
    this.delegate?.onCreateInstanceFromJSON(stateMachine as EndlicherAutomat);
    return stateMachine;
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

  override activeStates(word: string): Set<State> {
    return new Set<State>();
  }
}

// Defines methods for handling events when creating or initializing a new automaton
export interface EndlicherAutomatDelegate {
  onCreateInstanceFromJSON(endlicherAutomat: EndlicherAutomat): void;
  onCreateNewInstanceFromJSON(endlicherAutomat: EndlicherAutomat): void;
}
