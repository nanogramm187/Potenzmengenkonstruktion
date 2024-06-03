import { Injectable } from '@angular/core';
import { StatemachineService } from '../../../../statemachine/src/lib/statemachine/statemachine.service';
import { EndlicherAutomat } from '../../endlicherautomat/EndlicherAutomat';

@Injectable({
  providedIn: 'root'
})
export class TapeService {

  constructor(public service: StatemachineService) { }

  private get endlicherAutomat(): EndlicherAutomat {
    return this.service.stateMachine as EndlicherAutomat;
  }

  get splitPosition(): number {
    return this.endlicherAutomat.splitPosition;
  }

  skipToEnd() {
    this.endlicherAutomat.skipToEnd();
  }

  nextStep() {
    this.endlicherAutomat.nextStep();
  }

  reset() {
    this.endlicherAutomat.reset();
  }

  hasPreviousStep(): boolean {
    return this.endlicherAutomat.hasPreviousStep();
  }

  previousStep() {
    this.endlicherAutomat.previousStep();
  }

  hasNextStep(): boolean {
    return this.endlicherAutomat.hasNextStep();
  }
}
