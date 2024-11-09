import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  EndlicherAutomat,
  EndlicherAutomatDelegate,
} from '../endlicherautomat/EndlicherAutomat';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-inputTable',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,
  ],
  templateUrl: './inputTable.component.html',
  styleUrl: './inputTable.component.scss',
})
export class InputTableComponent
  implements OnInit, AfterViewChecked, EndlicherAutomatDelegate
{
  constructor(public service: StatemachineService) {}

  @ViewChild('AButton') aButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('EButton') eButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('firstCellInput', { static: false }) firstCellInput!: ElementRef;
  focusedInput: HTMLInputElement | null = null;
  isFirstFocusApplied: boolean = false;
  isLearningMode: boolean = false;

  get stateMachine(): EndlicherAutomat {
    return this.service.stateMachine as EndlicherAutomat;
  }

  get uniqueTransitionSymbols(): string[] {
    return this.stateMachine.uniqueTransitionSymbols;
  }

  get dfaStates(): string[] {
    return this.stateMachine.dfaStates;
  }

  get sortedDfaStates(): string[] {
    return this.stateMachine.sortedDfaStates;
  }

  isDeterministic(): boolean {
    return this.service.isDeterministic();
  }

  // Method to show the info message
  showAlert() {
    alert(
      'Falls der Hilfemodus bei gewissen Zellen nicht funktioniert, bitte wieder aus- und einschalten .'
    );
  }

  // Focus on the first input after view is checked
  ngAfterViewChecked() {
    if (!this.isFirstFocusApplied && this.firstCellInput) {
      this.firstCellInput.nativeElement.focus();
      this.isFirstFocusApplied = true;
    }
  }

  setFocusedCell(input: HTMLInputElement) {
    this.focusedInput = input;
  }

  // Sets value in the focused cell
  setFocusedValue(value: string) {
    // Updates the focused input's value based on the button clicked
    if (this.focusedInput) {
      const currentValue = this.focusedInput.value;
      const valuesArray = currentValue
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item);

      const valueIndex = valuesArray.findIndex(
        (item) => item.toLowerCase() === value.toLowerCase()
      );

      // Toggle for value
      if (valueIndex !== -1) {
        valuesArray.splice(valueIndex, 1);
      } else {
        valuesArray.push(value);
      }

      // Sort values with special handling for '(a)' and '(e)'
      const sortedArray = valuesArray.sort((a, b) => {
        const specialOrder = ['(a)', '(e)'];
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();

        if (specialOrder.includes(aLower) && !specialOrder.includes(bLower)) {
          return 1;
        } else if (
          !specialOrder.includes(aLower) &&
          specialOrder.includes(bLower)
        ) {
          return -1;
        } else {
          return a.localeCompare(b);
        }
      });

      this.focusedInput.value = sortedArray.join(', ');

      this.focusedInput.focus();
    }
  }

  // Method to toggle the learning mode
  toggleLearningMode(event: any) {
    this.isLearningMode = event.checked;
    if (this.isLearningMode) {
      this.service.showDeterministicStates = false;
      this.learningMode();
    }
  }

  // Untoggle the slide toggle when the checkbox is checked
  toggleCheckbox(event: any) {
    this.service.showDeterministicStates = event.checked;
    if (this.service.showDeterministicStates) {
      this.isLearningMode = false;
    }
  }

  // Shows expected states, transitions and start-/endbutton
  learningMode() {
    const dfaTable = this.stateMachine.generateDFATable();
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          const focusListener = () => {
            if (this.isLearningMode) {
              // If first column, highlight states
              if (cellIndex === 0) {
                const expectedStateNames = dfaTable[rowIndex + 1][cellIndex]
                  .split(/[\s,]+/)
                  .map((name) => name.trim());
                this.highlightStates(expectedStateNames);
                console.log(expectedStateNames);
              }
              // For other columns, highlight transitions
              else {
                const startStates = dfaTable[rowIndex + 1][0]
                  .split(/[\s,]+/)
                  .map((state) => state.trim());
                const expectedValue = dfaTable[rowIndex + 1][cellIndex];
                const symbol = this.uniqueTransitionSymbols[cellIndex - 1];
                this.highlightTransitions(startStates, symbol, expectedValue);
                console.log(startStates, symbol, expectedValue);
              }
            }
          };

          const blurListener = () => {
            this.clearHighlights();
          };

          input.addEventListener('focus', focusListener);
          input.addEventListener('blur', blurListener);
        }
      });
    });
  }

  // Method to highlight buttons or states of the first column based on expected values
  highlightStates(stateNames: string[]) {
    // Highlight buttons
    if (stateNames.includes('(A)')) {
      this.aButton.nativeElement.style.backgroundColor = '#65a800';
    }
    if (stateNames.includes('(E)')) {
      this.eButton.nativeElement.style.backgroundColor = '#65a800';
    }
    // Highlight ∅ button if necessary
    if (stateNames.includes('∅')) {
      const emptyButton = Array.from(document.querySelectorAll('button')).find(
        (button) => button.innerText.trim() === '∅'
      );
      if (emptyButton) {
        emptyButton.style.backgroundColor = '#65a800';
      }
    }
    // Highlight states
    this.stateMachine.getAllStates().forEach((state) => {
      if (stateNames.includes(state.name)) state.highlight = true;
    });
  }

  // Method to highlight transitions of every column except the first one based on expected values
  highlightTransitions(
    startStates: string[],
    symbol: string,
    targetStates: string
  ) {
    this.stateMachine
      .getAllStates()
      .flatMap((state) => state.transitions)
      // Filter transitions based on start state, the symbol and target states in expectedValue
      .filter(
        (transition: any) =>
          startStates.includes(transition.source.name) &&
          transition.transitionSymbols.includes(symbol) &&
          targetStates.includes(transition.destination.name)
      )
      .forEach((transition) => (transition.highlight = true));

    // Highlight ∅ button if targetStates includes '∅'
    if (targetStates.includes('∅')) {
      document.querySelectorAll('button').forEach((button) => {
        if (button.innerText.trim() === '∅') {
          button.style.backgroundColor = '#65a800';
        }
      });
    }
  }

  // Method to clear the highlights
  clearHighlights() {
    // Clear transitions and states highlights
    const allStates = this.stateMachine.getAllStates();
    allStates.forEach((state) => {
      state.highlight = false;
      state.transitions.forEach((transition) => (transition.highlight = false));
    });

    // Clear buttons
    this.aButton.nativeElement.style.backgroundColor = '';
    this.eButton.nativeElement.style.backgroundColor = '';
    document.querySelectorAll('button').forEach((button) => {
      if (button.innerText.trim() === '∅') {
        button.style.backgroundColor = '';
      }
    });
  }

  // Compares the input table with table from dfa
  checkTable() {
    const dfaTable = this.stateMachine.generateDFATable();
    const tableRows = document.querySelectorAll('tbody tr');
    const CORRECT_COLOR = 'rgb(52, 236, 52)';
    const INCORRECT_COLOR = 'red';
    let allCorrect = true;

    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          // Get and clean the input value (split, sort, and join)
          const inputValueArray = input.value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '')
            .split(',')
            .sort();

          // Get and clean the expected value (split, sort, and join)
          const expectedValueArray = dfaTable[rowIndex + 1][cellIndex]
            .toLowerCase()
            .replace(/\s+/g, '')
            .split(',')
            .sort();

          // Compare the sorted arrays
          const isCorrect =
            JSON.stringify(inputValueArray) ===
            JSON.stringify(expectedValueArray);

          // Set background color based on correctness
          input.style.backgroundColor = isCorrect
            ? CORRECT_COLOR
            : INCORRECT_COLOR;
          if (!isCorrect) {
            allCorrect = false;
          }
        }
      });
    });
    // Show congratulations popup if all cells are correct after they are colored
    if (allCorrect) {
      setTimeout(() => {
        alert('Glückwunsch! Alle Antworten sind korrekt.');
      }, 100);
    }
    setTimeout(() => {
      if (this.firstCellInput) {
        this.firstCellInput.nativeElement.focus();
      }
    });
  }

  // Resets input and color in every cell
  resetTable() {
    const inputs = document.querySelectorAll(
      'tbody td input'
    ) as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
      input.value = '';
      input.style.backgroundColor = 'white';
    });
    this.focusedInput = null;
    setTimeout(() => {
      if (this.firstCellInput) {
        this.firstCellInput.nativeElement.focus();
      }
    });
  }

  ngOnInit(): void {
    this.stateMachine.delegate = this;
    // Temporarily disable learning mode and then re-enable it
    const wasLearningModeEnabled = this.isLearningMode;
    this.isLearningMode = false;

    // Now re-enable learning mode if it was active before
    if (wasLearningModeEnabled) {
      setTimeout(() => {
        this.isLearningMode = true;
        this.learningMode(); // Reapply listeners and initialize learning mode on the new automaton
      }, 0); // Using a timeout to ensure it's set up after DOM updates
    }
  }

  onCreateInstanceFromJSON(endlicherAutomat: EndlicherAutomat): void {
    this.resetTable();
    endlicherAutomat.delegate = this;
    // Temporarily disable learning mode and then re-enable it
    const wasLearningModeEnabled = this.isLearningMode;
    this.isLearningMode = false;
    if (wasLearningModeEnabled) {
      setTimeout(() => {
        this.isLearningMode = true;
        this.learningMode();
      }, 0);
    }
  }
}
