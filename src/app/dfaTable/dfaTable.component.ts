import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';

@Component({
  selector: 'app-dfaTable',
  templateUrl: './dfaTable.component.html',
  styleUrls: ['./dfaTable.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatTableModule, CommonModule],
})
export class DfaTableComponent {
  dfaTable: string[][] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { table: any[] },
    private service: StatemachineService
  ) {}

  // Gets automat through service
  get stateMachine(): EndlicherAutomat {
    return this.service.stateMachine as EndlicherAutomat;
  }

  // Initializes DFA table when the component is loaded
  ngOnInit(): void {
    this.dfaTable = this.stateMachine.generateDfaTable();
  }
}
