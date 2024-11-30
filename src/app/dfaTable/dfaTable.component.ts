import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
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
  constructor(private service: StatemachineService) {}

  // Gets automat through service
  get stateMachine(): EndlicherAutomat {
    return this.service.stateMachine as EndlicherAutomat;
  }

  // Generates the DFA table
  dfaTable(): string[][] {
    return this.stateMachine.generateDfaTable();
  }
}
