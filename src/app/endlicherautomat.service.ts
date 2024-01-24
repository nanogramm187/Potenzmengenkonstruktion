import { Injectable } from '@angular/core';
import { StateMachine } from './core/endlicherautomat/statemachine';
import { State } from './core/endlicherautomat/state';
import { StateEditDialogComponent } from './core/statemachineview/state-edit-dialog/state-edit-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransitionEditDialogComponent } from './core/statemachineview/transition-edit-dialog/transition-edit-dialog.component';
import { Transition } from './core/endlicherautomat/stateconnections/Transition';

@Injectable({
  providedIn: 'root'
})
export class EndlicherautomatService {

  stateMachine!: StateMachine;

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

  isActiveState(state: State): boolean {
    return false;
  }

  addState(x: number, y: number): State {
    return this.stateMachine.addState(x, y);
  }

  deleteState(state: State): void {
    this.stateMachine.deleteState(state);
  }

  addTransition(source: State, destination: State): Transition {
      return this.stateMachine.addTransition(source, destination);
  }

  addDummyTransition(source: State, destination: State): Transition {
    throw "Not Implemented";
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
    // TODO: - Find transition for source and destination.
    throw "Not implemented"
    //return transition.openTransitionDialog(dialog);
  }
}
