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

  setFocusedValue(value: string) {
    // Updates the focused input's value based on the button clicked
    if (this.focusedInput) {
      const currentValue = this.focusedInput.value;
      const valuesArray = currentValue
        .split(/[\s,]+/) // Split by spaces and commas
        .map((item) => item.trim()) // Remove spaces around each item
        .filter((item) => item); // Remove any empty items

      const valueIndex = valuesArray.findIndex(
        (item) => item.toLowerCase() === value.toLowerCase()
      );

      // Toggle for value
      if (valueIndex !== -1) {
        valuesArray.splice(valueIndex, 1); // Remove the value if it exists
      } else {
        valuesArray.push(value); // Add the value if it doesn't exist
      }

      // Separate out the special cases for '(a)' and '(e)'
      const normalValues = valuesArray.filter(
        (item) => item.toLowerCase() !== '(a)' && item.toLowerCase() !== '(e)'
      );
      const aAndEValues = valuesArray.filter(
        (item) => item.toLowerCase() === '(a)' || item.toLowerCase() === '(e)'
      );

      // Ensure '(a)' comes before '(e)' if both are present
      const aValue = aAndEValues.find((item) => item.toLowerCase() === '(a)');
      const eValue = aAndEValues.find((item) => item.toLowerCase() === '(e)');

      // Combine the values with '(a)' first and then '(e)'
      const combinedValues = [...normalValues];
      if (aValue) combinedValues.push(aValue); // Add '(a)' if it exists
      if (eValue) combinedValues.push(eValue); // Add '(e)' if it exists

      // Create a formatted array with special handling for '(a)' and '(e)'
      const formattedArray = combinedValues.map((item, index) => {
        // If it's the first value, just return it without a comma
        if (index === 0) {
          return item;
        }

        // For '(a)' and '(e)', add a space before it, for others add a comma and space
        if (item.toLowerCase() === '(a)' || item.toLowerCase() === '(e)') {
          return ' ' + item; // No comma, just space
        } else {
          return ', ' + item; // Add comma and space for other items
        }
      });

      // Join the formatted array into a single string and update the input's value
      this.focusedInput.value = formattedArray.join(''); // Join without extra commas between values

      // Refocus the input element
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

  // Method to show the info message
  showAlert() {
    alert(
      'Falls der Hilfemodus bei neu generierten Zellen nicht funktioniert, bitte wieder aus- und einschalten .'
    );
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
    this.initializeComponent(endlicherAutomat);
  }

  onCreateNewInstanceFromJSON(endlicherAutomat: EndlicherAutomat): void {
    this.initializeComponent(endlicherAutomat);
  }

  private initializeComponent(endlicherAutomat: EndlicherAutomat): void {
    this.resetTable();
    endlicherAutomat.delegate = this;

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
