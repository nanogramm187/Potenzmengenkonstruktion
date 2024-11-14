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
    const dfaTable = this.stateMachine.generateDfaTable();
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
                // console.log(expectedStateNames);
              }
              // For other columns, highlight transitions
              else {
                const startStates = dfaTable[rowIndex + 1][0]
                  .split(/[\s,]+/)
                  .map((state) => state.trim());
                const expectedValue = dfaTable[rowIndex + 1][cellIndex];
                const symbol = this.uniqueDfaTransitionSymbols[cellIndex - 1];
                this.highlightTransitions(startStates, symbol, expectedValue);
                //  console.log(startStates, symbol, expectedValue);
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
  /*checkTable() {
    /*
    // Set von neuen Zuständen die überprüft werden dürfen.
    let set: Set<string> = new Set(dfaTable[1]);
    // 2d-Array von Korrektheit der Zellen.
    let cells: boolean[][] = Array.from({ length: tableRows.length }, () =>
      Array(dfaTable[0].length).fill(false)
    );
    
    // Initialisiere das Set mit den neuen Zuständen, die bereits richtig sind.

    tableRows.forEach((rows, rowIndex) => {
      const tdRow = rows.querySelectorAll('td');
      // Wenn das erste Element in der Reihe im Set enthalten ist, soll die Reihe überprüft werden.
      if (set.has(tdRow[0].toString())) {
        tdRow.forEach((column, columnIndex) => {
          cells[rowIndex][columnIndex] =
            dfaTable[rowIndex][columnIndex] == column.toString();
        });
      }
    });
 const dfaTable = this.stateMachine.generateDfaTable();
    const tableRows = document.querySelectorAll('tbody tr');
    const CORRECT_COLOR = 'rgb(52, 236, 52)';
    const INCORRECT_COLOR = 'red';
    let allCorrect = true;

    // Nur die erste Zeile von dfaTable in RowSet einfügen
    const RowSet = new Set(dfaTable[1]);
    console.log(RowSet);

    // Funktion zum Überprüfen einer Zeile
    const checkRow = (rowIndex: number, row: Element) => {
      const rowCells = row.querySelectorAll('td'); // Alle Zellen in der aktuellen Zeile

      RowSet.forEach((value) => {
        // Suche den Wert in der ersten Spalte von dfaTable
        const dfaRowIndex = dfaTable.findIndex((dfaRow) => dfaRow[0] === value);

        // Wenn der Wert gefunden wurde
        if (dfaRowIndex !== -1) {
          const dfaRow = dfaTable[dfaRowIndex];
          let isMatch = true;

          // Vergleiche jede Zelle der gefundenen Zeile mit der entsprechenden Zelle in der aktuellen Eingabezeile
          rowCells.forEach((cell, cellIndex) => {
            const input = cell.querySelector(
              'input'
            ) as HTMLInputElement | null;
            if (input) {
              const inputValueArray = input.value
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '')
                .split(',')
                .sort();

              const expectedValueArray = dfaRow[cellIndex]
                .toLowerCase()
                .replace(/\s+/g, '')
                .split(',')
                .sort();

              if (
                JSON.stringify(inputValueArray) !==
                JSON.stringify(expectedValueArray)
              ) {
                isMatch = false;
              }
            }
          });

          // Wenn die Zeile übereinstimmt, lösche den Wert aus RowSet und färbe die gesamte Zeile grün
          if (isMatch) {
            RowSet.delete(value);
            rowCells.forEach((cell) => {
              const input = cell.querySelector(
                'input'
              ) as HTMLInputElement | null;
              if (input) {
                input.style.backgroundColor = CORRECT_COLOR;
              }
            });
          }
        }
      });
    };

    // Alle Zeilen durchlaufen und überprüfen
    tableRows.forEach((row, rowIndex) => {
      checkRow(rowIndex, row);
    });

    // Show congratulations popup if all cells in the first row are correct after they are colored
    if (allCorrect) {
      setTimeout(() => {
        alert('Glückwunsch! Alle Antworten sind korrekt.');
      }, 100);
    }

    setTimeout(() => {
      if (this.firstCellInput) {
        this.firstCellInput.nativeElement.focus();
      }
    }, 100);
  }
*/
  checkTable() {
    const dfaTable = this.stateMachine.generateDfaTable();
    const tableRows = document.querySelectorAll('tbody tr');
    const CORRECT_COLOR = 'rgb(52, 236, 52)';
    const INCORRECT_COLOR = 'red';
    let allCorrect = true;

    // Initialisiere rowSet mit dem ersten Wert der zweiten Zeile
    const rowSet = new Set([dfaTable[1][0]]);
    const doneSet = new Set();
    console.log('rowset', rowSet);
    console.log('doneset', doneSet);

    //help
    const endStates = [this.stateMachine.finalStates];

    console.log('name:', endStates);
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      const firstCellValue = cells[0].querySelector('input')?.value.trim();

      if (rowIndex === 0) {
        const isFirstCellCorrect = firstCellValue && rowSet.has(firstCellValue);

        if (!isFirstCellCorrect) {
          cells.forEach((cell) => {
            const input = cell.querySelector(
              'input'
            ) as HTMLInputElement | null;
            if (input) {
              input.style.backgroundColor = INCORRECT_COLOR;
            }
          });
          allCorrect = false;
          return;
        }

        cells.forEach((cell, cellIndex) => {
          const input = cell.querySelector('input') as HTMLInputElement | null;
          if (input) {
            const inputValueArray = input.value
              .trim()
              .toLowerCase()
              .replace(/\s+/g, '')
              .split(',')
              .sort();
            const expectedValueArray = dfaTable[rowIndex + 1][cellIndex]
              .toLowerCase()
              .replace(/\s+/g, '')
              .split(',')
              .sort();

            const isCorrect =
              JSON.stringify(inputValueArray) ===
              JSON.stringify(expectedValueArray);

            input.style.backgroundColor = isCorrect
              ? CORRECT_COLOR
              : INCORRECT_COLOR;

            if (isCorrect) {
              let cellValue = dfaTable[rowIndex + 1][cellIndex];

              // Überprüfe, ob der cellValue ein Endzustand ist und füge ' (E)' hinzu
              if (endStates.includes(cellValue)) {
                cellValue += ' (E)';
              }

              // Füge den Wert dem rowSet hinzu, falls er korrekt ist und noch nicht im doneSet steht
              if (!doneSet.has(cellValue)) {
                rowSet.add(cellValue);
              }
            } else {
              allCorrect = false;
            }
          }
        });
      } else {
        const isFirstCellCorrect = firstCellValue && rowSet.has(firstCellValue);

        if (!isFirstCellCorrect) {
          cells.forEach((cell) => {
            const input = cell.querySelector(
              'input'
            ) as HTMLInputElement | null;
            if (input) {
              input.style.backgroundColor = INCORRECT_COLOR;
            }
          });
          allCorrect = false;
          return;
        }

        rowSet.delete(firstCellValue);
        doneSet.add(firstCellValue);

        const matchingRow = dfaTable.find((row) => row[0] === firstCellValue);

        if (matchingRow) {
          cells.forEach((cell, cellIndex) => {
            const input = cell.querySelector(
              'input'
            ) as HTMLInputElement | null;
            if (input) {
              const inputValueArray = input.value
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '')
                .split(',')
                .sort();
              const expectedValueArray = matchingRow[cellIndex]
                .toLowerCase()
                .replace(/\s+/g, '')
                .split(',')
                .sort();

              const isCorrect =
                JSON.stringify(inputValueArray) ===
                JSON.stringify(expectedValueArray);

              input.style.backgroundColor = isCorrect
                ? CORRECT_COLOR
                : INCORRECT_COLOR;

              if (isCorrect) {
                let cellValue = matchingRow[cellIndex];

                // Überprüfe, ob der cellValue ein Endzustand ist und füge ' (E)' hinzu
                if (endStates.includes(cellValue)) {
                  cellValue += ' (E)';
                }

                // Füge den Wert dem rowSet hinzu, falls er korrekt ist und noch nicht im doneSet steht
                if (!doneSet.has(cellValue)) {
                  rowSet.add(cellValue);
                }
              } else {
                allCorrect = false;
              }
            }
          });
        }
      }
    });

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
