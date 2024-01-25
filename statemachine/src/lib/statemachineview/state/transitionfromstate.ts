import { Arrow } from "../../statemachine/drawingprimitives/Arrow";
import { Point } from "../../statemachine/drawingprimitives/Point";
import { State } from "../../statemachine/state";
import { StatemachineviewComponent } from "../statemachineview.component";
import { DefaultState } from "./defaultstate";
import { StateMachineViewState } from "./statemachineviewstate";
import { TransitionToState } from "./transitiontostate";
import { TransitionNewStateEditState } from "./transtionnewstateeditstate";

export class TransitionFromState extends StateMachineViewState {

    private transitionFrom: State;
    private drawingDestination: Point = Point.zero;
  
    constructor(statemachineviewComponent: StatemachineviewComponent, transitionFrom: State) {
      super(statemachineviewComponent);
      this.transitionFrom = transitionFrom;
    }
  
    override onMouseUp(event: MouseEvent): void {
      const newState = this.statemachineviewComponent.statemachineService.addState(this.drawingDestination.x, this.drawingDestination.y);
      const transitionState = new TransitionNewStateEditState(this.statemachineviewComponent, this.transitionFrom, newState);
      this.statemachineviewComponent.changeState(transitionState);
    }
  
    override onEntireCircleMouseDown(event: MouseEvent, state: State): void {
      const boundary = this.boundary;
      this.drawingDestination.x = event.clientX - boundary.left;
      this.drawingDestination.y = event.clientY - boundary.top;
    }
  
    override onCircleEnter(event: MouseEvent, state: State): void {
      const transitionToState = new TransitionToState(this.statemachineviewComponent, this.transitionFrom, state);
      this.changeState(transitionToState);
    }
  
    override onEntireCircleMouseUp(event: MouseEvent, state: State): void {
      this.statemachineviewComponent.changeState(new DefaultState(this.statemachineviewComponent));
    }
  
    override onMouseMove(event: MouseEvent): void {
      const boundary = this.boundary;
      this.drawingDestination.x = event.clientX - boundary.left;
      this.drawingDestination.y = event.clientY - boundary.top;
    }
  
    override drawingTransitionOrigin(): Point {
      return this.transitionFrom.origin;
    }
  
    override drawingTransitionDestination(): Point {
      return this.drawingDestination.moveToPoint(this.transitionFrom.origin, Arrow.transition.width * 2);
    }
  
    override showStartConnection(state: State): boolean {
      return this.transitionFrom === state;
    }
  
    override showDrawingTransition(): boolean {
      return true;
    }
  }