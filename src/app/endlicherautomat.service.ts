import { Injectable } from '@angular/core';
import { TuringState } from './core/endlicherautomat/turingstate';
import { Point } from './core/endlicherautomat/drawingprimitives/Point';
import { StateConnection } from './core/endlicherautomat/stateconnections/StateConnection';
import { StateConnectionFactory } from './core/endlicherautomat/stateconnections/StateConnectionFactory';
import { Automata } from './core/endlicherautomat/automata';
import { Direction, TuringEdge } from './core/endlicherautomat/turingedges';

@Injectable({
  providedIn: 'root'
})
export class EndlicherautomatService {

  stateMachine!: Automata;

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

  addTransition(from: any, to: any, symbol: string): TuringState {
      return new TuringState(new Point(0, 0));
  }

  addDummyTransition(from: TuringState, to: TuringState): TuringEdge {
    return new TuringEdge(from, to, '', '', Direction.None);
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
