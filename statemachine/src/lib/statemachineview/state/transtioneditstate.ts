import { State } from "../../statemachine/state";
import { Transition } from "../../statemachine/stateconnections/Transition";
import { StatemachineviewComponent } from "../statemachineview.component";
import { DefaultState } from "./defaultstate";
import { StateMachineViewState } from "./statemachineviewstate";

export class TransitionEditState extends StateMachineViewState {

  transitionFrom: State;
  transitionTo: State;
  dummyTransition: Transition;

  constructor(
    statemachineviewComponent: StatemachineviewComponent, 
    transitionFrom: State,
    transitionTo: State,
    dummyTransition: Transition)
  {
    super(statemachineviewComponent);
    this.transitionFrom = transitionFrom;
    this.transitionTo = transitionTo;
    this.dummyTransition = dummyTransition;

    const transitionState = new DefaultState(this.statemachineviewComponent);

    const dialogRef = this.statemachineviewComponent
      .statemachineService
      .openTransitionEditDialog(
        this.transitionFrom,
        this.transitionTo,
        this.statemachineviewComponent.dialog);

    dialogRef.afterClosed().subscribe(result => {
      if (this.dummyTransition.isEmpty()) {
        this.statemachineviewComponent.statemachineService.removeTransition(this.dummyTransition);
      }
      this.statemachineviewComponent.changeState(transitionState);
      this.transitionFrom.outerCircleHovered = false;
      this.transitionTo.outerCircleHovered = false;
      this.transitionTo.outerCircleHovered = false;
    });
  }

  override onMouseUp(event: MouseEvent): void {}
  override onCircleLeave(event: MouseEvent, state: State): void {}
  override showDrawingTransition(): boolean { return false }

  override showStartConnection(state: State): boolean {
    return this.transitionFrom === state;
  }

  override showEndConnection(state: State): boolean {
    return this.transitionTo === state;
  }
}