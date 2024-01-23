import { TuringEdge } from "../../endlicherautomat/turingedges";
import { TuringState } from "../../endlicherautomat/turingstate";
import { StatemachineviewComponent } from "../statemachineview.component";
import { StateMachineViewState } from "./statemachineviewstate";
import { TransitionFromState } from "./transitionfromstate";
import { TransitionEditState } from "./transtioneditstate";

export class TransitionToState extends StateMachineViewState {

    protected transitionFrom: TuringState;
    protected transitionTo: TuringState;
    protected dummyTransition: TuringEdge;
  
    constructor(
      statemachineviewComponent: StatemachineviewComponent, 
      transitionFrom: TuringState,
      transitionTo: TuringState)
    {
      super(statemachineviewComponent);
      this.transitionFrom = transitionFrom;
      this.transitionTo = transitionTo;
      this.dummyTransition = this.statemachineviewComponent.turingmachineService.addDummyTransition(transitionFrom, transitionTo);
    }
  
    override onMouseUp(event: MouseEvent): void {
      const transitionState = new TransitionEditState(this.statemachineviewComponent, this.transitionFrom, this.transitionTo, this.dummyTransition);
      this.statemachineviewComponent.changeState(transitionState);
    }
  
    override onCircleLeave(event: MouseEvent, state: TuringState): void {
      this.dummyTransition.delete();
      const transitionState = new TransitionFromState(this.statemachineviewComponent, this.transitionFrom);
      this.statemachineviewComponent.changeState(transitionState);
    }
  
    override showStartConnection(state: TuringState): boolean {
      return this.transitionFrom === state;
    }
  
    override showEndConnection(state: TuringState): boolean {
      return this.transitionTo === state;
    }
  }