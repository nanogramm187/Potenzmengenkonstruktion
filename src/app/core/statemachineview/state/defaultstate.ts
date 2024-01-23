import { TuringState } from "../../endlicherautomat/turingstate";
import { MoveNodeState } from "./movestate";
import { StateMachineViewState } from "./statemachineviewstate";
import { TransitionFromState } from "./transitionfromstate";

export class DefaultState extends StateMachineViewState {
  
    override onInnerCircleMouseDown(event: MouseEvent, state: TuringState): void {
      state.innerCircleHovered = true;
      const moveNodeState = new MoveNodeState(this.statemachineviewComponent, state);
      this.statemachineviewComponent.changeState(moveNodeState);
    }
  
    override onOuterCircleMouseDown(event: MouseEvent, state: TuringState): void {
      const transitionState = new TransitionFromState(this.statemachineviewComponent, state);
      this.statemachineviewComponent.changeState(transitionState);
    }
  
    override onInnerCircleEnter(event: MouseEvent, state: TuringState): void {
      this.statemachineviewComponent.zone.run(() => state.innerCircleHovered = true);
    }
  
    override onInnerCircleLeave(event: MouseEvent, state: TuringState): void {
      this.statemachineviewComponent.zone.run(() => state.innerCircleHovered = false);
    }
  
    override onOuterCircleEnter(event: MouseEvent, state: TuringState): void {
      this.statemachineviewComponent.zone.run(() => state.outerCircleHovered = true);
    }
  
    override onOuterCircleLeave(event: MouseEvent, state: TuringState): void {
      this.statemachineviewComponent.zone.run(() => state.outerCircleHovered = false);
    }
  }