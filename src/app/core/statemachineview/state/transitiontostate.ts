import { State } from "../../statemachine/state";
import { Transition } from "../../statemachine/stateconnections/Transition";
import { StatemachineviewComponent } from "../statemachineview.component";
import { StateMachineViewState } from "./statemachineviewstate";
import { TransitionFromState } from "./transitionfromstate";
import { TransitionEditState } from "./transtioneditstate";

export class TransitionToState extends StateMachineViewState {

    protected transitionFrom: State;
    protected transitionTo: State;
    protected dummyTransition: Transition;
  
    constructor(
      statemachineviewComponent: StatemachineviewComponent, 
      transitionFrom: State,
      transitionTo: State)
    {
      super(statemachineviewComponent);
      this.transitionFrom = transitionFrom;
      this.transitionTo = transitionTo;
      this.dummyTransition = this.statemachineviewComponent.statemachineService.addDummyTransition(transitionFrom, transitionTo);
    }
  
    override onMouseUp(event: MouseEvent): void {
      const transitionState = new TransitionEditState(this.statemachineviewComponent, this.transitionFrom, this.transitionTo, this.dummyTransition);
      this.statemachineviewComponent.changeState(transitionState);
    }
  
    override onCircleLeave(event: MouseEvent, state: State): void {
      this.dummyTransition.delete();
      const transitionState = new TransitionFromState(this.statemachineviewComponent, this.transitionFrom);
      this.statemachineviewComponent.changeState(transitionState);
    }
  
    override showStartConnection(state: State): boolean {
      return this.transitionFrom === state;
    }
  
    override showEndConnection(state: State): boolean {
      return this.transitionTo === state;
    }
  }