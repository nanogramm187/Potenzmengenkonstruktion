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

  // Normalizes input
  normalizeValue(value: any) {
    return value.trim().toLowerCase().replace(/\s+/g, '').split(',').sort();
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
      this.activateRows([...Array(tableRows.length).keys()]); // Activate all rows

      tableRows.forEach((row, i) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell) => {
          const input = cell.querySelector('input') as HTMLInputElement | null;
          if (input) {
            input.disabled = false;
            input.style.background = 'white';
            input.removeEventListener('blur', this.blurListener); // Ensure the listener is removed
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
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          input.disabled = true;
        }
      });
    });

    // Activate already correct cells
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      let rowIsCorrect = true;

      cells.forEach((cell, cellIndex) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          const expectedValue = dfaTable[rowIndex + 1][cellIndex];
          if (input.value.trim() !== expectedValue) {
            rowIsCorrect = false;
          }
          let inputValue = input.value.trim();
          if (inputValue === expectedValue) {
            const inputParts = inputValue.split(/[\s,]+/);
            const isEndState = inputParts.some((part) => {
              return endStates.some((state: any) => {
                return state === part;
              });
            });
            if (isEndState) {
              inputValue += ' (E)';
            }
            // Add row that matches the first cell to the inputValue
            const matchingRowIndex =
              dfaTable.findIndex((row) => row[0] === inputValue) - 1;

            // If valid, activate row
            if (matchingRowIndex !== -1) {
              if (!activeRows.includes(matchingRowIndex)) {
                activeRows.push(matchingRowIndex);
              }
              this.activateRows(activeRows);
            }
          } else {
            input.value = '';
          }
        }
      });

      // If the row is correct, add it to activeRows
      if (rowIsCorrect && rowIndex > 0) {
        activeRows.push(rowIndex);
      }
    });
    this.activateRows(activeRows);

    //Highlight states, buttons and transitions
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          const focusListener = () => {
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
          };
          input.addEventListener('focus', focusListener);
          input.addEventListener('blur', this.blurListener);
        }
      });
    });
  }

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
        if (input) {
          let inputValue = input.value.trim();
          const expectedValue = dfaTable[rowIndex + 1][cellIndex];
          // Add an (E) to value if it has an endState
          if (inputValue === expectedValue) {
            const inputParts = inputValue.split(/[\s,]+/);
            const isEndState = inputParts.some((part) =>
              endStates.includes(part)
            );
            if (isEndState) {
              inputValue += ' (E)';
            }
            // Add row that matches the first cell to the inputValue
            const matchingRowIndex =
              dfaTable.findIndex((row) => row[0] === inputValue) - 1;

            // If valid, activate row
            if (matchingRowIndex !== -1) {
              const inputElement = cells[0].querySelector(
                'input'
              ) as HTMLInputElement;
              const firstCellValue = inputElement.value.trim();
              const expectedFirstCellValue = dfaTable[rowIndex + 1][0];
              if (firstCellValue === expectedFirstCellValue) {
                if (!activeRows.includes(matchingRowIndex)) {
                  activeRows.push(matchingRowIndex);
                }
              }
            }
          } else {
            // Dont deactivate if the same value is present
            const row = tableRows[rowIndex];
            let shouldDeactivate = true;
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
              const otherInput = cell.querySelector(
                'input'
              ) as HTMLInputElement | null;
              if (otherInput && index !== cellIndex) {
                const otherInputValue = otherInput.value.trim();
                const otherExpectedValue = dfaTable[rowIndex + 1][index];
                if (otherInputValue === otherExpectedValue) {
                  shouldDeactivate = false;
                }
              }
            });
            if (shouldDeactivate) {
              const matchingRowIndex = dfaTable.findIndex(
                (row) => row[0] === expectedValue
              );
              if (matchingRowIndex !== -1) {
                const rowToDeactivate = matchingRowIndex - 1;
                // Do not deactivate first row, the row we are in and the rows above
                if (
                  rowToDeactivate > 0 &&
                  rowToDeactivate !== rowIndex &&
                  rowToDeactivate > rowIndex
                ) {
                  activeRows = activeRows.filter((r) => r !== rowToDeactivate);
                  const deactivatedRow = tableRows[rowToDeactivate];
                  const deactivatedCells =
                    deactivatedRow.querySelectorAll('td');
                  deactivatedCells.forEach((cell) => {
                    const input = cell.querySelector(
                      'input'
                    ) as HTMLInputElement | null;
                    if (input) {
                      input.value = ''; // Clear the input value
                    }
                  });
                }
              }
            }
          }
        }
        this.activateRows(activeRows);

        this.clearHighlights();
      });
    });
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          const rowIndex = Array.from(tableRows).indexOf(row);
          const isRowActive = activeRows.includes(rowIndex);

          // Clear input if the row is not active (i.e., it is deactivated)
          if (!isRowActive) {
            input.value = ''; // Clear the input value for deactivated rows
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

  // Compares the input table with table from dfa gradually
  checkTable() {
    const dfaTable = this.stateMachine.generateDfaTable();
    const tableRows = document.querySelectorAll('tbody tr');
    const CORRECT_COLOR = 'lightgreen';
    const INCORRECT_COLOR = 'salmon';
    const endStates = Array.from(this.stateMachine.finalStates).map(
      (state: any) => state.name
    );
    // Initialising rowSet with startState
    const toDoSet = new Set([dfaTable[1][0]]);
    const doneSet = new Set();

    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const firstCellValue = cells[0].querySelector('input')?.value.trim();
      const isFirstCellCorrect = firstCellValue && toDoSet.has(firstCellValue);

      if (!isFirstCellCorrect) {
        cells.forEach((cell) => {
          const input = cell.querySelector('input') as HTMLInputElement | null;
          if (input) {
            input.style.backgroundColor = INCORRECT_COLOR;
          }
        });
        return;
      }

      toDoSet.delete(this.normalizeValue(firstCellValue));
      doneSet.add(this.normalizeValue(firstCellValue));

      // Find row in dfaTable which corresponds to the current one
      const matchingRow = dfaTable.find((row) => row[0] === firstCellValue);
      if (matchingRow) {
        cells.forEach((cell, cellIndex) => {
          const input = cell.querySelector('input') as HTMLInputElement | null;
          if (input) {
            const inputValueArray = this.normalizeValue(input.value);
            const expectedValueArray = this.normalizeValue(
              matchingRow[cellIndex]
            );

            const isCorrect =
              JSON.stringify(inputValueArray) ===
              JSON.stringify(expectedValueArray);
            input.style.backgroundColor = isCorrect
              ? CORRECT_COLOR
              : INCORRECT_COLOR;

            if (isCorrect) {
              let cellValue = matchingRow[cellIndex];
              const cellValueParts = cellValue.split(/[\s,]+/);

              // Check if cellValue has endState
              const isEndState = cellValueParts.some((part) => {
                return endStates.some((state: any) => {
                  return state === part;
                });
              });
              if (isEndState) {
                cellValue += ' (E)';
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

    // Show alert if every cell is correct
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
  resetTable() {
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const input = cell.querySelector('input') as HTMLInputElement | null;
        if (input) {
          input.value = '';
          input.style.backgroundColor = 'white';
          // Disable all inputs except those in the first row (rowIndex !== 0)
          if (rowIndex !== 0 && this.isLearningMode) {
            input.disabled = true;
          } else {
            input.disabled = false; // Ensure first row inputs are enabled
          }
        }
      });
    });

    this.focusedInput = null;
    this.focusFirstCellInput();
  }

  ngOnInit(): void {
    this.stateMachine.delegate = this;
  }

  onCreateInstanceFromJSON(endlicherAutomat: EndlicherAutomat): void {
    this.initializeComponent(endlicherAutomat);
    const wasLearningModeEnabled = this.isLearningMode;
    this.isLearningMode = false;

    if (wasLearningModeEnabled) {
      setTimeout(() => {
        this.isLearningMode = true;
        this.learningMode();
      }, 0);
    }
  }

  onCreateNewInstanceFromJSON(endlicherAutomat: EndlicherAutomat): void {
    this.initializeComponent(endlicherAutomat);
    this.isLearningMode = false;
  }

  private initializeComponent(endlicherAutomat: EndlicherAutomat): void {
    this.resetTable();
    endlicherAutomat.delegate = this;
    this.focusFirstCellInput();
  }

  private focusFirstCellInput(): void {
    setTimeout(() => {
      if (this.firstCellInput) {
        this.firstCellInput.nativeElement.focus();
      }
    });
  }
}
