import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { Testcase } from './testcase';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TestcaseService } from './testcase.service';
import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';

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
export class TestcaseComponent {
  
  constructor(public service: StatemachineService) {}

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
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases = testcases;
  }

  get notAcceptingTestcases(): Testcase[] {
    return (this.service.stateMachine as EndlicherAutomat).negativeTestcases;
  }

  set notAcceptingTestcases(testcases: Testcase[]) {
    (this.service.stateMachine as EndlicherAutomat).negativeTestcases = testcases;
  }

  addAcceptingInput() {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases.push(new Testcase(this.service.stateMachine as EndlicherAutomat));
  }

  removeAcceptingInput(index: number) {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases.splice(index, 1);
  }

  addNotAcceptingInput() {
    (this.service.stateMachine as EndlicherAutomat).negativeTestcases.push(new Testcase(this.service.stateMachine as EndlicherAutomat));
  }

  removeNotAcceptingInput(index: number) {
    (this.service.stateMachine as EndlicherAutomat).negativeTestcases.splice(index, 1);
  }
}
