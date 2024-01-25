import { State } from "../../statemachine/state";
import { MoveNodeState } from "./movenodestate";
import { StateMachineViewState } from "./statemachineviewstate";
import { TransitionFromState } from "./transitionfromstate";

export class DefaultState extends StateMachineViewState {
  
    override onInnerCircleMouseDown(event: MouseEvent, state: State): void {
      state.innerCircleHovered = true;
      const moveNodeState = new MoveNodeState(this.statemachineviewComponent, state);
      this.statemachineviewComponent.changeState(moveNodeState);
    }
  
    override onOuterCircleMouseDown(event: MouseEvent, state: State): void {
      const transitionState = new TransitionFromState(this.statemachineviewComponent, state);
      this.statemachineviewComponent.changeState(transitionState);
    }
  
    override onInnerCircleEnter(event: MouseEvent, state: State): void {
      this.statemachineviewComponent.zone.run(() => state.innerCircleHovered = true);
    }
  
    override onInnerCircleLeave(event: MouseEvent, state: State): void {
      this.statemachineviewComponent.zone.run(() => state.innerCircleHovered = false);
    }
  
    override onOuterCircleEnter(event: MouseEvent, state: State): void {
      this.statemachineviewComponent.zone.run(() => state.outerCircleHovered = true);
    }
  
    override onOuterCircleLeave(event: MouseEvent, state: State): void {
      this.statemachineviewComponent.zone.run(() => state.outerCircleHovered = false);
    }
  }