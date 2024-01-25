// Angular imports
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
// Service imports
import { StatemachineService } from '../statemachine.service';
// Model and utility imports
import { Arrow } from '../statemachine/drawingprimitives/Arrow';
import { State } from '../statemachine/state';
import { Point } from '../statemachine/drawingprimitives/Point';
import { StateMachineViewState } from './state/statemachineviewstate';
import { DefaultState } from './state/defaultstate';
import { Transition } from '../statemachine/stateconnections/Transition';
import { Label } from '../statemachine/stateconnections/Label';

@Component({
  selector: 'app-statemachineview',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './statemachineview.component.html',
  styleUrl: './statemachineview.component.scss'
})
export class StatemachineviewComponent implements OnInit, OnDestroy {

  START_TRANSITION_ARROW_LENGTH: number = 55;
  ARROW_LENGTH: number = 5;
  @ViewChild('svgField') svgFieldElementRef!: ElementRef;

  constructor(
    public statemachineService: StatemachineService, 
    public dialog: MatDialog,
    public zone: NgZone,
  ) {}

  private mouseMoveListener: any;
  private mouseUpListener: any;
  private readonly circleRadius = State.circleRadius;

  get outerCircleRadius(): number {
    return this.circleRadius + 15;
  }

  ngOnInit() {
    this.addEventListeners();
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault()
  }

  private addEventListeners() {
    this.mouseMoveListener = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.mouseMoveListener);
    this.mouseUpListener = this.onMouseUp.bind(this);
    document.addEventListener('mouseup', this.mouseUpListener);
  }

  private removeEventListeners() {
    document.removeEventListener('mousemove', this.mouseMoveListener);
    document.removeEventListener('mouseup', this.mouseUpListener);
  }

  private onMouseMove(event: MouseEvent) {
    this.stateMachineViewState.onMouseMove(event);
  }

  private onMouseUp(event: MouseEvent) {
    this.stateMachineViewState.onMouseUp(event);
  }

  protected onInnerCircleMouseDown(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onInnerCircleMouseDown(event, state);
  }

  protected onInnerCircleMouseUp(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onInnerCircleMouseUp(event, state);
  }

  protected onOuterCircleMouseDown(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onOuterCircleMouseDown(event, state);
  }

  protected onOuterCircleMouseUp(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onOuterCircleMouseUp(event, state);
  }

  protected onEntireCircleMouseDown(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onEntireCircleMouseDown(event, state);
  }

  protected onEntireCircleMouseUp(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onEntireCircleMouseUp(event, state);
  }

  protected onCircleEnter(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onCircleEnter(event, state);
  }

  protected onCircleLeave(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onCircleLeave(event, state);
  }

  protected onInnerCircleEnter(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onInnerCircleEnter(event, state);
  }

  protected onInnerCircleLeave(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onInnerCircleLeave(event, state);
  }

  protected onOuterCircleEnter(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onOuterCircleEnter(event, state);
  }

  protected onOuterCircleLeave(event: MouseEvent, state: State): void {
    this.stateMachineViewState.onOuterCircleLeave(event, state);
  }

  /// Returns true, if the transition from the given state is currently being drawn.
  protected showStartConnection(state: State): boolean {
    return this.stateMachineViewState.showStartConnection(state);
  }

  /// Returns true, if the transition to the given state is currently being drawn.
  protected showEndConnection(state: State): boolean {
    return this.stateMachineViewState.showEndConnection(state);
  }

  protected showDrawingTransition(): boolean {
    return this.stateMachineViewState.showDrawingTransition();
  }

  protected drawingTransitionOrigin(): Point {
    return this.stateMachineViewState.drawingTransitionOrigin();
  }

  protected drawingTransitionDestination(): Point {
    return this.stateMachineViewState.drawingTransitionDestination();
  }

  get arrow(): Arrow {
    return Arrow.transition;
  }

  get transitions(): Transition[] {
    return this.statemachineService.transitions;
  }

  toggleTestcaseView() {
    this.statemachineService.toggleTestcaseView();
  }

  get testcaseViewIsVisible(): boolean {
    return this.statemachineService.testcaseViewIsVisible;
  }
  
  editTransition(stateConnection: Transition, event: MouseEvent): void {
    event.preventDefault();
    const source = stateConnection.source;
    const destination = stateConnection.destination;
    this.statemachineService.openTransitionEditDialog(source, destination, this.dialog);
  }

  openStateEditDialog(state: State, event: MouseEvent): void {
    event.preventDefault();
    this.statemachineService.openStateEditDialog(state, this.dialog);
  }

  drawState(event: MouseEvent) {
    const x = (event.clientX - (event.target as SVGElement).getBoundingClientRect().left);
    const y = (event.clientY - (event.target as SVGElement).getBoundingClientRect().top);
    this.statemachineService.addState(x, y);
  }

  getStates(): State[] {
    return this.statemachineService.states;
  }
  
  isFinalState(state: State): boolean {
    return this.statemachineService.isFinalState(state);
  }

  isStartState(state: State): boolean {
    return this.statemachineService.isStartState(state);
  }

  isActiveState(state: State): boolean {
    return this.statemachineService.isActiveState(state);
  }

  // Show Not Deterministic States
  showDeterministicStates(): boolean {
    return this.statemachineService.showDeterministicStates;
  }

  public stateMachineViewState: StateMachineViewState = new DefaultState(this);

  changeState(state: StateMachineViewState) {
    this.stateMachineViewState = state;
  }

  // Dummy Functions
  getTranslate(transition: Transition, index: number): number {
    return 0
  }

  labels(transition: Transition): Label[] {
    return transition.labels()
  }
}