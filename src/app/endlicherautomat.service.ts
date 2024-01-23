import { Injectable } from '@angular/core';
import { TuringState } from './core/endlicherautomat/turingstate';
import { Point } from './core/endlicherautomat/drawingprimitives/Point';
import { StateConnection } from './core/endlicherautomat/stateconnections/StateConnection';
import { StateConnectionFactory } from './core/endlicherautomat/stateconnections/StateConnectionFactory';
import { StateMachine } from './core/endlicherautomat/statemachine';
import { Direction, TuringEdge } from './core/endlicherautomat/turingedges';
import { State } from './core/endlicherautomat/state';
import { Edge } from './core/endlicherautomat/edge';

@Injectable({
  providedIn: 'root'
})
export class EndlicherautomatService {

  stateMachine!: StateMachine;

  constructor() { }

  get states(): Set<any> {
    return new Set<any>();
  }

  isFinalState(state: any): boolean {
    return true;
  }

  isStartState(state: any): boolean {
    return true;
  }

  isActiveState(state: any): boolean {
    return true;
  }

  addState(x: number, y: number): TuringState {
    return new TuringState(new Point(x, y));
  }

  deleteState(state: any): void {

  }

  addTransition(from: State, to: State, symbol: string): TuringState {
      return new TuringState(new Point(0, 0));
  }

  addDummyTransition(from: State, to: State): Edge {
    return new TuringEdge(from as TuringState, to as TuringState, '', '', Direction.None);
  }

  get stateConnections(): StateConnection[] {
    return StateConnectionFactory.makeStateConnections(this.stateMachine);
  }

  toggleTestcaseView(): void {

  }

  get testcaseViewIsVisible(): boolean {
    return true;
  }

  get showDeterministicStates(): boolean {
    return true;
  }
}
