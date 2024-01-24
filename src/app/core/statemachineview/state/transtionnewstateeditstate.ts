import { State } from "../../statemachine/state";
import { Transition } from "../../statemachine/stateconnections/Transition";
import { StatemachineviewComponent } from "../statemachineview.component";
import { DefaultState } from "./defaultstate";
import { StateMachineViewState } from "./statemachineviewstate";

export class TransitionNewStateEditState extends StateMachineViewState {

    transitionFrom: State;
    transitionTo: State;
    dummyTransition: Transition;
  
    constructor(
      statemachineviewComponent: StatemachineviewComponent, 
      transitionFrom: State,
      transitionTo: State)
    {
      super(statemachineviewComponent);
      this.transitionFrom = transitionFrom;
      this.transitionTo = transitionTo;
      this.dummyTransition = this.statemachineviewComponent.statemachineService.addDummyTransition(transitionFrom, transitionTo);
  
      const dialogRef = this.statemachineviewComponent
      .statemachineService
      .openTransitionEditDialog(
        this.transitionFrom,
        this.transitionTo,
        this.statemachineviewComponent.dialog);
  
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.statemachineviewComponent.statemachineService.deleteState(this.transitionTo);
        }
        this.transitionFrom.outerCircleHovered = false;
        this.transitionTo.outerCircleHovered = false;
        this.transitionTo.outerCircleHovered = false;
        this.dummyTransition.delete();
        this.statemachineviewComponent.changeState(new DefaultState(this.statemachineviewComponent));
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