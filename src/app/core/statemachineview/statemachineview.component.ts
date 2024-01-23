// Angular imports
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
// Service imports
import { EndlicherautomatService } from '../../endlicherautomat.service';
// Component imports
import { StateEditDialogComponent } from './state-edit-dialog/state-edit-dialog.component';
import { TransitionEditDialogComponent } from './transition-edit-dialog/transition-edit-dialog.component';
// Model and utility imports
import { TuringState } from '../endlicherautomat/turingstate';
import { StateConnection } from '../endlicherautomat/stateconnections/StateConnection';
import { Arrow } from '../endlicherautomat/drawingprimitives/Arrow';
import { StateGraphic } from '../endlicherautomat/stategraphic';
import { Point } from '../endlicherautomat/drawingprimitives/Point';
import { Configuration } from '../endlicherautomat/configuration';
import { StateMachineViewState } from './state/statemachineviewstate';
import { DefaultState } from './state/defaultstate';

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
    public turingmachineService: EndlicherautomatService, 
    public dialog: MatDialog,
    public zone: NgZone,
    public cdr: ChangeDetectorRef
  ) {}

  private canvas: HTMLCanvasElement = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  public fontSize: number = 16; 
  public fontFamily: string = 'Arial';

  private mouseMoveListener: any;
  private mouseUpListener: any;
  private readonly circleRadius = StateGraphic.circleRadius;

  get outerCircleRadius(): number {
    return this.circleRadius + 15;
  }

  getTapeContent(): Configuration[] {
    // return this.turingmachineService.configurationList.configurations;
    return [];
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

  protected onInnerCircleMouseDown(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onInnerCircleMouseDown(event, state);
  }

  protected onInnerCircleMouseUp(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onInnerCircleMouseUp(event, state);
  }

  protected onOuterCircleMouseDown(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onOuterCircleMouseDown(event, state);
  }

  protected onOuterCircleMouseUp(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onOuterCircleMouseUp(event, state);
  }

  protected onEntireCircleMouseDown(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onEntireCircleMouseDown(event, state);
  }

  protected onEntireCircleMouseUp(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onEntireCircleMouseUp(event, state);
  }

  protected onCircleEnter(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onCircleEnter(event, state);
  }

  protected onCircleLeave(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onCircleLeave(event, state);
  }

  protected onInnerCircleEnter(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onInnerCircleEnter(event, state);
  }

  protected onInnerCircleLeave(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onInnerCircleLeave(event, state);
  }

  protected onOuterCircleEnter(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onOuterCircleEnter(event, state);
  }

  protected onOuterCircleLeave(event: MouseEvent, state: TuringState): void {
    this.stateMachineViewState.onOuterCircleLeave(event, state);
  }

  /// Returns true, if the transition from the given state is currently being drawn.
  protected showStartConnection(state: TuringState): boolean {
    return this.stateMachineViewState.showStartConnection(state);
  }

  /// Returns true, if the transition to the given state is currently being drawn.
  protected showEndConnection(state: TuringState): boolean {
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

  get stateConnections(): StateConnection[] {
    return this.turingmachineService.stateConnections;
  }

  toggleTestcaseView() {
    this.turingmachineService.toggleTestcaseView();
  }

  get testcaseViewIsVisible(): boolean {
    return this.turingmachineService.testcaseViewIsVisible;
  }
  
  editTransition(stateConnection: StateConnection, event: MouseEvent): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(TransitionEditDialogComponent, {
      width: '545px',
      autoFocus: false,
      data: {
        sourceState: stateConnection.source,
        destinationState: stateConnection.destination,
      }
    });
  }

  openStateEditDialog(state: TuringState, event: MouseEvent): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(StateEditDialogComponent, {
      width: '270px',
      data: {state: state}
    });
  }

  drawState(event: MouseEvent) {
    const x = (event.clientX - (event.target as SVGElement).getBoundingClientRect().left);
    const y = (event.clientY - (event.target as SVGElement).getBoundingClientRect().top);
    this.turingmachineService.addState(x, y);
  }

  getStates(): Set<TuringState> {
    return this.turingmachineService.states;
  }
  
  isFinalState(state: TuringState): boolean {
    return this.turingmachineService.isFinalState(state);
  }

  isStartState(state: TuringState): boolean {
    return this.turingmachineService.isStartState(state);
  }

  getTextPosition(transition: StateConnection, id: number): Point {
    // Setzen des Schriftstils für den Canvas-Kontext
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    
    // Berechnung der Höhe basierend auf der Anzahl der Kanten und der Schriftgröße
    const height = transition.edges.length * this.fontSize;

    // Berechnung der maximalen Breite der Übergangslabels
    const width = transition.edges
      .map((edge) => this.ctx.measureText(edge.transitionLabel()).width)
      .reduce((a, b) => Math.max(a, b), 0);

    // Abrufen der Textposition von der Übergangsinstanz
    const position = transition.getTextPosition(width, height);

    // Anpassung der y-Position basierend auf der Anzahl der Kanten
    const adjusted = new Point(position.x, position.y - (transition.edges.length - 1) * this.fontSize / 2);

    return adjusted;
  }

  getTranslate(transition: StateConnection, id: number): string {
    const point = this.getTextPosition(transition, id);
    return `translate(${point.x}, ${point.y})`;
  }

  labels(connection: StateConnection): string[] {
    return connection.edges
    .map((edge) => edge.transitionLabel())
  }

  isActiveState(state: TuringState): boolean {
    return this.turingmachineService.isActiveState(state);
  }

  // Show Not Deterministic States
  showDeterministicStates(): boolean {
    return this.turingmachineService.showDeterministicStates;
  }

  public stateMachineViewState: StateMachineViewState = new DefaultState(this);

  changeState(state: StateMachineViewState) {
    this.stateMachineViewState = state;
  }
}