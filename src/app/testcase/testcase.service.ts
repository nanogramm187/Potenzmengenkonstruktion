import { Injectable } from '@angular/core';
import { Testcase } from './testcase';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';

@Injectable({
  providedIn: 'root',
})
export class TestcaseService {
  constructor(public service: StatemachineService) {}

  get testcases(): Testcase[] {
    return (this.service.stateMachine as EndlicherAutomat).positiveTestcases;
  }

  set testcases(testcases: Testcase[]) {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases =
      testcases;
  }

  addAcceptingInput() {
    this.testcases.push(
      new Testcase(this.service.stateMachine as EndlicherAutomat)
    );
  }

  removeAcceptingInput(index: number) {
    this.testcases.splice(index, 1);
  }
}
