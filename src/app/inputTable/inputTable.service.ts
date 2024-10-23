import { Injectable } from '@angular/core';
import { InputTable } from './inputTable';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';

@Injectable({
  providedIn: 'root',
})
export class InputTableService {
  constructor(public service: StatemachineService) {}

  /** 
  get testcases(): InputTable[] {
    return (this.service.stateMachine as EndlicherAutomat).positiveTestcases;
  }

  set testcases(testcases: InputTable[]) {
    (this.service.stateMachine as EndlicherAutomat).positiveTestcases =
      testcases;
  }

  addAcceptingInput() {
    this.testcases.push(
      new InputTable(this.service.stateMachine as EndlicherAutomat)
    );
  }

  removeAcceptingInput(index: number) {
    this.testcases.splice(index, 1);
  }
  */
}
