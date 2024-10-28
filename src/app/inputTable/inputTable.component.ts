import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';
import { InputTableService } from './inputTable.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
  ],
  templateUrl: './inputTable.component.html',
  styleUrl: './inputTable.component.scss',
})
export class InputTableComponent implements AfterViewChecked {
  constructor(
    public service: StatemachineService,
    public inputTableService: InputTableService
  ) {}

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

  learningMode() {
    const dfaTable = this.stateMachine.generateDFATable();
    const tableRows = document.querySelectorAll('tbody tr');
    const suggestionDisplay = document.getElementById('suggestion-display');

    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          // Create new event listeners
          const focusListener = () => {
            const expectedValue = dfaTable[rowIndex + 1][cellIndex];
            if (suggestionDisplay) {
              suggestionDisplay.textContent = `Vorgeschlagener Wert: ${expectedValue}`;
            }
          };

          const blurListener = () => {
            if (suggestionDisplay) {
              suggestionDisplay.textContent = ''; // Clear suggestion text completely
            }
          };

          // Remove previous listeners to prevent duplicates
          input.removeEventListener('focus', focusListener);
          input.removeEventListener('blur', blurListener);

          // Assign the new listeners
          input.addEventListener('focus', focusListener);
          input.addEventListener('blur', blurListener);
        }
      });
    });
  }

  toggleLearningMode(event: any) {
    this.isLearningMode = event.checked;
    const suggestionDisplay = document.getElementById('suggestion-display');

    if (this.isLearningMode) {
      this.learningMode();
    } else {
      // Clear the suggestion display when toggling off
      if (suggestionDisplay) {
        suggestionDisplay.textContent = ''; // Clear suggestion text
      }
    }
  }

  // Compares the input table with table from dfa
  checkTable() {
    const dfaTable = this.stateMachine.generateDFATable();
    const tableRows = document.querySelectorAll('tbody tr');
    const CORRECT_COLOR = 'rgb(52, 236, 52)';
    const INCORRECT_COLOR = 'red';

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
        }
      });
    });

    this.firstCellInput.nativeElement.focus();
  }

  // Resets input and color in every cell
  resetTable() {
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const input = cell.querySelector('input');
        if (input) {
          (input as HTMLInputElement).value = '';
          input.style.backgroundColor = 'white';
        }
      });
    });
    this.focusedInput = null;
    this.firstCellInput.nativeElement.focus();
  }

  /** 
  isStartStateDefined(): boolean {
    return this.service.isStartStateDefined();
  }

  get acceptingTestcases(): InputTable[] {
    return (this.service.stateMachine as EndlicherAutomat).positiveTestcases;
  }

  set acceptingTestcases(testcases: InputTable[]) {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases =
      testcases;
  }

  get notAcceptingTestcases(): InputTable[] {
    return (this.service.stateMachine as EndlicherAutomat).negativeTestcases;
  }

  set notAcceptingTestcases(testcases: InputTable[]) {
    (this.service.stateMachine as EndlicherAutomat).negativeTestcases =
      testcases;
  }

  addAcceptingInput() {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases.push(
      new InputTable(this.service.stateMachine as EndlicherAutomat)
    );
  }

  removeAcceptingInput(index: number) {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases.splice(
      index,
      1
    );
  }

  addNotAcceptingInput() {
    (this.service.stateMachine as EndlicherAutomat).negativeTestcases.push(
      new InputTable(this.service.stateMachine as EndlicherAutomat)
    );
  }

  removeNotAcceptingInput(index: number) {
    (this.service.stateMachine as EndlicherAutomat).negativeTestcases.splice(
      index,
      1
    );
  }

  getAcceptedWordsCount() {
    let acceptedWordsCount = 0;
    this.stateMachine.positiveTestcases.forEach((testcase) => {
      if (testcase.isAccepting()) {
        acceptedWordsCount++;
      }
    });
    this.stateMachine.negativeTestcases.forEach((testcase) => {
      if (!testcase.isAccepting()) {
        acceptedWordsCount++;
      }
    });
    return acceptedWordsCount;
  }

  getWordsCount() {
    return (
      this.stateMachine.positiveTestcases.length +
      this.stateMachine.negativeTestcases.length
    );
  }

  getAcceptedWordsPercentage() {
    return !isNaN((this.getAcceptedWordsCount() / this.getWordsCount()) * 100)
      ? ((this.getAcceptedWordsCount() / this.getWordsCount()) * 100).toFixed(1)
      : '0.0';
  }

  getAcceptedWordsDivColour() {
    let color: string = 'grey';
    if (this.getWordsCount() && this.stateMachine.startState) {
      color = 'red';
      if (this.getWordsCount() == this.getAcceptedWordsCount()) {
        color = 'green';
      }
    }
    return color;
  }
  */
}
