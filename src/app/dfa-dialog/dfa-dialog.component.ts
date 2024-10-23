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
  dfaTable: string[][] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { table: any[] },
    private service: StatemachineService
  ) {}

  get stateMachine(): EndlicherAutomat {
    return this.service.stateMachine as EndlicherAutomat;
  }

  get uniqueTransitionSymbols(): string[] {
    return this.stateMachine.uniqueTransitionSymbols;
  }

  get dfaZustaende(): string[] {
    return this.stateMachine.dfaZustaende;
  }
  ngOnInit(): void {
    this.dfaTable = this.stateMachine.generateDFATable();
  }
}
