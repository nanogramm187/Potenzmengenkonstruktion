import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { Testcase } from './testcase';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';
import { TestcaseService } from './testcase.service';

@Component({
  selector: 'app-testcase',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIcon,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './testcase.component.html',
  styleUrl: './testcase.component.scss',
})
export class TestcaseComponent implements AfterViewChecked {
  constructor(
    public service: StatemachineService,
    public testcaseService: TestcaseService
  ) {}

  focusedInput: HTMLInputElement | null = null;

  @ViewChild('firstCellInput', { static: false }) firstCellInput!: ElementRef;
  private isFirstFocusApplied: boolean = false;

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
    //Wenn ein Input Feld fokussiert wird
    if (this.focusedInput) {
      const currentValue = this.focusedInput.value;
      //Values mit Komma trennen etc.
      const valuesArray = currentValue
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item);
      //Index des Values finden
      const valueIndex = valuesArray.findIndex(
        (item) => item.toLowerCase() === value.toLowerCase()
      );

      //Toggle für value
      if (valueIndex !== -1) {
        valuesArray.splice(valueIndex, 1);
      } else {
        valuesArray.push(value);
      }

      //A und E bleiben am Ende des Arrays
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
      //Fokus bleibt in der Zelle
      this.focusedInput.focus();
    }
  }

  solution: string[][] = [
    ['S0, (A)', 'S0', 'S1'],
    ['S0, S1', 'S0', 'S1'],
  ];

  checkTable() {
    const tableRows = document.querySelectorAll('tbody tr'); // Tabellenzeilen
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td'); // Zellen der aktuellen Zeile
      cells.forEach((cell, cellIndex) => {
        const input = cell.querySelector('input'); // Eingabefeld in der Zelle
        const inputValue = input ? input.value.trim() : ''; // Aktueller Wert der Zelle
        const expectedValue = this.solution[rowIndex][cellIndex]; // Vergleiche mit der Lösung

        // Zelle und Input rot oder grün färben
        if (inputValue === expectedValue) {
          cell.style.backgroundColor = 'rgb(52, 236, 52)';
          if (input) {
            input.style.backgroundColor = 'rgb(52, 236, 52)';
          }
        } else {
          cell.style.backgroundColor = 'red';
          if (input) {
            input.style.backgroundColor = 'red';
          }
        }
      });
    });
    setTimeout(() => {
      if (this.firstCellInput) {
        this.firstCellInput.nativeElement.focus();
      }
    });
  }

  resetTable() {
    const tableRows = document.querySelectorAll('tbody tr'); // Get all rows
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td'); // Get all cells
      cells.forEach((cell) => {
        const input = cell.querySelector('input'); // Get input in the cell
        if (input) {
          (input as HTMLInputElement).value = ''; // Clear the input value
          input.style.backgroundColor = 'white'; // Set input background color to white
        }
        cell.style.backgroundColor = 'white'; // Set cell background color to white
      });
    });

    this.focusedInput = null;
    setTimeout(() => {
      if (this.firstCellInput) {
        this.firstCellInput.nativeElement.focus(); // Focus on the first input if needed
      }
    });
  }
  get uniqueTransitionSymbols(): string[] {
    const symbolSet = new Set<string>();
    this.stateMachine.getAllTransitions().forEach((transition) => {
      transition.labels().forEach((label) => {
        const symbols = label.text.split(',');
        symbols.forEach((symbol) => symbolSet.add(symbol.trim()));
      });
    });

    return Array.from(symbolSet);
  }
  get currentZustaende(): string[] {
    return this.stateMachine.getAllStates().map((state) => state.name);
  }

  get stateMachine(): EndlicherAutomat {
    return this.service.stateMachine as EndlicherAutomat;
  }

  isDeterministic(): boolean {
    return this.service.isDeterministic();
  }

  isStartStateDefined(): boolean {
    return this.service.isStartStateDefined();
  }

  get acceptingTestcases(): Testcase[] {
    return (this.service.stateMachine as EndlicherAutomat).positiveTestcases;
  }

  set acceptingTestcases(testcases: Testcase[]) {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases =
      testcases;
  }

  get notAcceptingTestcases(): Testcase[] {
    return (this.service.stateMachine as EndlicherAutomat).negativeTestcases;
  }

  set notAcceptingTestcases(testcases: Testcase[]) {
    (this.service.stateMachine as EndlicherAutomat).negativeTestcases =
      testcases;
  }

  addAcceptingInput() {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases.push(
      new Testcase(this.service.stateMachine as EndlicherAutomat)
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
      new Testcase(this.service.stateMachine as EndlicherAutomat)
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
}
