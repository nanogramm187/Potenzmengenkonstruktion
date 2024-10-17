import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';

@Component({
  selector: 'app-dfa-dialog',
  templateUrl: './dfa-dialog.component.html',
  styleUrls: ['./dfa-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatTableModule, CommonModule],
})
export class DfaDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { table: any[] },
    private service: StatemachineService
  ) {}

  get stateMachine(): EndlicherAutomat {
    return this.service.stateMachine as EndlicherAutomat;
  }

  get uniqueTransitionSymbols(): string[] {
    const symbolSet = new Set<string>();


    this.stateMachine.constructDFA().getAllTransitions().forEach((transition) => {
      transition.labels().forEach((label) => {
        const symbols = label.text.split(',');
        symbols.forEach((symbol) => symbolSet.add(symbol.trim()));
      });
    });

    return Array.from(symbolSet);
  }

  get currentZustaende(): string[] | undefined {
    return this.stateMachine.getAllStates().map((state) => state.name);
  }
}
