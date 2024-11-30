// Nicht kommentierte Methoden des Codes stammt aus dem vorgegebenen Projekt "Endlicher Automat"

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

  get uniqueDfaTransitionSymbols(): string[] {
    return this.stateMachine.uniqueDfaTransitionSymbols;
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

  // Focusses first cell
  private focusFirstCellInput(): void {
    setTimeout(() => {
      if (this.firstCellInput) {
        this.firstCellInput.nativeElement.focus();
      }
    });
  }

  // Sets the currently focused input element.
  setFocusedCell(input: HTMLInputElement) {
    this.focusedInput = input;
  }

  // Toggles a specified value within the focused input, managing special sorting for "(a)" and "(e)".
  setFocusedValue(value: string) {
    if (this.focusedInput) {
      const currentValue = this.focusedInput.value;
      const valuesArray = currentValue
        .split(/[\s,]+/)
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

      // Separate (a), (e) and other values, sort others alphabetically
      const specialOrder = ['(a)', '(e)'];
      const regularValues = valuesArray
        .filter((item) => !specialOrder.includes(item.toLowerCase()))
        .sort((a, b) => a.localeCompare(b)); // Alphabetical sort

      const specialValues = valuesArray
        .filter((item) => specialOrder.includes(item.toLowerCase()))
        .sort(
          (a, b) =>
            specialOrder.indexOf(a.toLowerCase()) -
            specialOrder.indexOf(b.toLowerCase())
        );

      // Merge arrays: regular values first, then (a) and (e)
      const formattedArray = [...regularValues, ...specialValues].map(
        (item, index) => {
          if (index === 0) return item;
          return specialOrder.includes(item.toLowerCase())
            ? ' ' + item
            : ', ' + item;
        }
      );

      this.focusedInput.value = formattedArray.join('');
      this.focusedInput.focus();
    }
  }

  // Method to toggle the learning mode
  toggleLearningMode(event: any) {
    this.isLearningMode = event.checked;
    if (this.isLearningMode) {
      this.service.showDeterministicStates = false;
      this.learningMode();
      this.firstCellInput.nativeElement.focus();

      const tableRows = document.querySelectorAll('tbody tr');
      tableRows.forEach((row, i) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell) => {
          const input = cell.querySelector('input') as HTMLInputElement | null;
          if (input) {
            input.style.background = 'white';
          }
        });
      });
    } else {
      const tableRows = document.querySelectorAll('tbody tr');
      // Activate all rows
      this.activateRows([...Array(tableRows.length).keys()]);

      tableRows.forEach((row, i) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell) => {
          const input = cell.querySelector('input') as HTMLInputElement | null;
          if (input) {
            input.disabled = false;
            input.style.background = 'white';
            input.removeEventListener('blur', this.blurListener);
          }
        });
      });
    }
  }

  // Method to show the info message
  showAlert() {
    alert(
      'Der Lernmodus gibt dir Hinweise auf die richtige Lösung.\nFalls der Lernmodus bei neu generierten Zellen nicht funktioniert, bitte einfach aus- und einschalten .'
    );
  }

  // Untoggle the slide toggle when the checkbox is checked
  toggleCheckbox(event: any) {
    this.service.showDeterministicStates = event.checked;
    if (this.service.showDeterministicStates) {
      this.isLearningMode = false;
    }
  }

  // Shows expected states, transitions and start-/endbutton gradually
  learningMode() {
    const dfaTable = this.stateMachine.generateDfaTable();
    const tableRows = document.querySelectorAll('tbody tr');
    const endStates = Array.from(this.stateMachine.finalStates).map(
      (state: any) => state.name
    );
    let activeRows: number[] = [0];

    // Disable all inputs
    tableRows.forEach((row) =>
      row.querySelectorAll('td input').forEach((input) => {
        (input as HTMLInputElement).disabled = true;
      })
    );

    // Activate already correct cells
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      let rowIsCorrect = true;

      cells.forEach((cell, cellIndex) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (!input) return;
        const processedInputValue = this.processValue(input.value);
        const processedExpectedValue = this.processValue(
          dfaTable[rowIndex + 1][cellIndex]
        );

        // Mark row as false and clear input if wrong
        if (processedInputValue !== processedExpectedValue) {
          rowIsCorrect = false;
          input.value = '';
          return;
        }

        // Add (E) if endState in value
        let cellValue = processedExpectedValue;
        const cellValueParts = cellValue.split(/[\s,]+/);
        const isEndState = cellValueParts.some((part) => {
          return endStates.some((state: any) => {
            return this.normalizeValue(state) === part;
          });
        });
        if (isEndState) {
          cellValue += '(e)';
        }

        // Add row that matches the first cell to the inputValue
        const matchingRowIndex =
          dfaTable.findIndex(
            (row) => this.normalizeValue(row[0]) === cellValue
          ) - 1;

        // If valid, activate row
        if (matchingRowIndex > -1 && !activeRows.includes(matchingRowIndex)) {
          activeRows.push(matchingRowIndex);
        }
      });

      // If the row is correct, add it to activeRows
      if (rowIsCorrect && rowIndex > 0) {
        activeRows.push(rowIndex);
      }
    });

    // Activate rows
    this.activateRows(activeRows);

    //Highlight states, buttons and transitions
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          input.addEventListener('focus', () => {
            if (this.isLearningMode) {
              // Highlight states in first column
              if (cellIndex === 0) {
                const expectedStateNames = dfaTable[rowIndex + 1][cellIndex]
                  .split(/[\s,]+/)
                  .map((name) => name.trim());
                this.highlightStates(expectedStateNames);
              } else {
                // Highlight transitions in other columns
                const startStates = dfaTable[rowIndex + 1][0]
                  .split(/[\s,]+/)
                  .map((state) => state.trim());
                const expectedValue = dfaTable[rowIndex + 1][cellIndex];
                const symbol = this.uniqueDfaTransitionSymbols[cellIndex - 1];
                this.highlightTransitions(startStates, symbol, expectedValue);
              }
            }
          });
          input.addEventListener('blur', this.blurListener);
        }
      });
    });
  }

  // Handles blur event in learningMode
  private blurListener = () => {
    const dfaTable = this.stateMachine.generateDfaTable();
    const tableRows = document.querySelectorAll('tbody tr');
    const endStates = Array.from(this.stateMachine.finalStates).map(
      (state: any) => state.name
    );
    let activeRows: number[] = [0];

    // If value is right, look for row in dfaTable and activate that row
    // If value is wrong, look for row in dfaTable and deactivate that row
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        if (cellIndex === 0) return;

        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (!input) return;

        let inputValue = this.normalizeValue(input.value);
        const expectedValue = this.normalizeValue(
          dfaTable[rowIndex + 1][cellIndex]
        );

        // Add an (E) to value if it has an endState
        if (inputValue === expectedValue) {
          const inputParts = inputValue.split(/[\s,]+/);
          const isEndState = inputParts.some((part) => {
            return endStates.some((state: any) => {
              return this.normalizeValue(state) === part;
            });
          });
          if (isEndState) {
            inputValue += ' (e)';
          }

          // Find row that matches the first cell to the inputValue
          const matchingRowIndex =
            dfaTable.findIndex(
              (row) => this.normalizeValue(row[0]) === inputValue
            ) - 1;

          // Activate row if higher index and not already activated
          if (
            matchingRowIndex > rowIndex &&
            !activeRows.includes(matchingRowIndex)
          ) {
            activeRows.push(matchingRowIndex);
          }
        } else {
          // Find corresponding row
          const matchingRowIndex =
            dfaTable.findIndex(
              (row) => this.normalizeValue(row[0]) === expectedValue
            ) - 1;

          // Deactivate row if conditions are met
          if (matchingRowIndex > rowIndex) {
            activeRows = activeRows.filter((r) => r !== matchingRowIndex);

            // Clear input values for deactivated rows
            const deactivatedRow = tableRows[matchingRowIndex];
            deactivatedRow.querySelectorAll('td').forEach((cell) => {
              const input = cell.querySelector(
                'input'
              ) as HTMLInputElement | null;
              if (input) {
                input.value = '';
              }
            });
          }
        }
      });
    });

    // Activate rows and clear highlights
    this.activateRows(activeRows);
    this.clearHighlights();

    // Reset input of deactivated rows
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          const rowIndex = Array.from(tableRows).indexOf(row);
          const isRowActive = activeRows.includes(rowIndex);
          if (!isRowActive) {
            input.value = '';
          }
        }
      });
    });
  };

  // Activates learningMode for specific rows
  activateRows(activeRows: number[]) {
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          input.disabled = !activeRows.includes(rowIndex);
        }
      });
    });
  }

  // Highlights buttons or states of the first column based on expected values
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

  // Highlights transitions of every column except the first one based on expected values
  highlightTransitions(
    startStates: string[],
    symbol: string,
    targetStates: string
  ) {
    this.stateMachine
      .getAllStates()
      .flatMap((state) => state.transitions)
      // Filter transitions based on start state, the symbol (and ε) and target states in expectedValue
      .filter(
        (transition: any) =>
          startStates.includes(transition.source.name) &&
          (transition.transitionSymbols.includes(symbol) || 'ε') &&
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

  // Normalizes input
  private normalizeValue(value: any): string {
    if (!value) return '';
    return value
      .toString()
      .replace(/\s+/g, ' ')
      .split(',')
      .map((item: any) => item.trim().toLowerCase())
      .sort()
      .join(',');
  }

  // Process value if start- or endstate is in it
  private processValue = (value: string): string => {
    if (!value) return '';
    const normalizedValue = this.normalizeValue(value);
    const match = normalizedValue.match(/\((a|e)\)/g);
    const suffix = match ? match[0] : '';
    const baseValue = normalizedValue.replace(/\((a|e)\)/g, '').trim();
    const normalizedBase = this.normalizeValue(baseValue);
    return `${normalizedBase}${suffix}`;
  };

  // Compares the input table with table from dfa gradually or normally in learningMode
  checkTable() {
    const dfaTable = this.stateMachine.generateDfaTable();
    const normalizedDfaTable = dfaTable.map((row) =>
      row.map((cell) => this.normalizeValue(cell))
    );
    const tableRows = document.querySelectorAll('tbody tr');
    const CORRECT_COLOR = 'lightgreen';
    const INCORRECT_COLOR = 'salmon';
    const endStates = Array.from(this.stateMachine.finalStates).map(
      (state: any) => state.name
    );

    // Compare exactly to dfaTable
    const checkInLearningMode = () => {
      tableRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
          const input = cell.querySelector('input') as HTMLInputElement | null;
          if (input) {
            const processedInputValue = this.processValue(input.value);
            const processedExpectedValue = this.processValue(
              dfaTable[rowIndex + 1][cellIndex]
            );

            const isCorrect = processedInputValue === processedExpectedValue;
            input.style.backgroundColor = isCorrect
              ? CORRECT_COLOR
              : INCORRECT_COLOR;
          }
        });
      });
    };

    // Compare gradually to dfaTable
    const checkInNormalMode = () => {
      // Remember the value that's toDo and that's done
      const toDoSet = new Set([this.processValue(dfaTable[1][0])]);
      const doneSet = new Set([
        this.processValue(dfaTable[1][0])
          .replace(/\(a\)$/, '')
          .trim(),
      ]);

      tableRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const firstCellValue =
          cells[0].querySelector('input')?.value?.trim() ?? '';
        const processedFirstCellValue = this.processValue(firstCellValue);
        const isFirstCellCorrect =
          processedFirstCellValue && toDoSet.has(processedFirstCellValue);

        // If first cell of a row is wrong, the whole row is wrong
        if (!isFirstCellCorrect) {
          cells.forEach((cell) => {
            const input = cell.querySelector(
              'input'
            ) as HTMLInputElement | null;
            if (input) {
              input.style.backgroundColor = INCORRECT_COLOR;
            }
          });
          return;
        }

        toDoSet.delete(processedFirstCellValue);
        doneSet.add(processedFirstCellValue);
        // Find the matching row in dfaTable using processed values
        const matchingRow = normalizedDfaTable.find(
          (row) => this.processValue(row[0]) == processedFirstCellValue
        );

        // Compare to row in dfaTable
        if (matchingRow) {
          cells.forEach((cell, cellIndex) => {
            const input = cell.querySelector(
              'input'
            ) as HTMLInputElement | null;
            if (input) {
              const processedInputValue = this.processValue(input.value);
              const processedExpectedValue = this.processValue(
                matchingRow[cellIndex]
              );
              const isCorrect = processedInputValue === processedExpectedValue;
              input.style.backgroundColor = isCorrect
                ? CORRECT_COLOR
                : INCORRECT_COLOR;
              if (isCorrect) {
                let cellValue = processedExpectedValue;
                const cellValueParts = cellValue.split(/[\s,]+/);

                // Check if cellValue has endState
                const isEndState = cellValueParts.some((part) => {
                  return endStates.some((state: any) => {
                    return this.normalizeValue(state) === part;
                  });
                });
                if (isEndState) {
                  cellValue += '(e)';
                }

                // Add the correct value to toDoSet if it has not been done already
                if (!doneSet.has(cellValue)) {
                  toDoSet.add(cellValue);
                }
              }
            }
          });
        }
      });
    };

    if (this.isLearningMode) {
      checkInLearningMode();
    } else {
      checkInNormalMode();
    }

    // Alert if every cell is right
    const allCorrect = Array.from(
      document.querySelectorAll('tbody td input')
    ).every((input) => {
      return (
        (input as HTMLInputElement).style.backgroundColor === CORRECT_COLOR
      );
    });
    if (allCorrect) {
      setTimeout(() => {
        alert('Glückwunsch! Alle Antworten sind korrekt.');
      }, 100);
    }

    this.firstCellInput.nativeElement.focus();
  }

  // Resets input and color in every cell
  // Disables cells based on learningMode
  resetTable() {
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          input.value = '';
          input.style.backgroundColor = 'white';
          if (rowIndex !== 0 && this.isLearningMode) {
            // Disable all inputs except those in the first row
            input.disabled = true;
          } else {
            // Disable no inputs
            input.disabled = false;
          }
        }
      });
    });

    this.focusedInput = null;
    this.focusFirstCellInput();
  }

  // Assigns delegate to inputTable
  ngOnInit(): void {
    this.stateMachine.delegate = this;
  }

  // Initializes and adapts to learningMode
  onCreateInstanceFromJSON(endlicherAutomat: EndlicherAutomat): void {
    this.initializeComponent(endlicherAutomat);
    if (this.isLearningMode) {
      setTimeout(() => {
        this.isLearningMode = true;
        this.learningMode();
      }, 0);
    }
  }

  // Initializes and sets learningMode to false to minimize problems new generated cells
  onCreateNewInstanceFromJSON(endlicherAutomat: EndlicherAutomat): void {
    this.initializeComponent(endlicherAutomat);
    this.isLearningMode = false;
  }

  // Resets table, initializes and focusses first cell
  private initializeComponent(endlicherAutomat: EndlicherAutomat): void {
    this.resetTable();
    endlicherAutomat.delegate = this;
    this.focusFirstCellInput();
  }
}
