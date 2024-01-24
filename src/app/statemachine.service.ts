import { Injectable } from '@angular/core';
import { StateMachine } from './core/statemachine/statemachine';
import { State } from './core/statemachine/state';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Transition } from './core/statemachine/stateconnections/Transition';
import { MockStateMachine } from './core/mockmachine/MockStateMachine';

@Injectable({
  providedIn: 'root'
})
export class StatemachineService {

  stateMachine: StateMachine = new MockStateMachine();

  constructor() { }

  get states(): State[] {
    return this.stateMachine.getAllStates();
  }

  isFinalState(state: State): boolean {
    return this.stateMachine.isFinalState(state);
  }

  isStartState(state: State): boolean {
    return this.stateMachine.isStartState(state);
  }

  addState(x: number, y: number): State {
    console.log(x + " " + y);
    return this.stateMachine.addState(x, y);
  }

  deleteState(state: State): void {
    this.stateMachine.deleteState(state);
  }

  addTransition(source: State, destination: State): Transition {
    return this.stateMachine.addTransition(source, destination);
  }

  addDummyTransition(source: State, destination: State): Transition {
    return this.stateMachine.addDummyTransition(source, destination);
  }

  get transitions(): Transition[] {
    return this.stateMachine.getAllTransitions();
  }

  toggleTestcaseView(): void {

  }

  get testcaseViewIsVisible(): boolean {
    return true;
  }

  get showDeterministicStates(): boolean {
    return true;
  }

  openStateEditDialog(state: State, dialog: MatDialog): MatDialogRef<any, any> {
    return state.openEditDialog(dialog);
  }

  openTransitionEditDialog(source: State, destination: State, dialog: MatDialog): MatDialogRef<any, any> {
    const transition = this.stateMachine.getTransition(source, destination);
    return transition.openTransitionDialog(dialog);
  }

  isActiveState(state: State): boolean {
    return false;
  }
}
