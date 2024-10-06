import { Component } from '@angular/core';
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
import { StateMachine } from 'statemachine/src/lib/statemachine/statemachine';

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
  constructor(
    public service: StatemachineService,
    public testcaseService: TestcaseService
  ) {}

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
