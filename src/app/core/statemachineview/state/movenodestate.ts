import { State } from "../../endlicherautomat/state";
import { StatemachineviewComponent } from "../statemachineview.component";
import { DefaultState } from "./defaultstate";
import { StateMachineViewState } from "./statemachineviewstate";

export class MoveNodeState extends StateMachineViewState {

    private movingState: State;
  
    private set movingStateX(value: number) {
      this.statemachineviewComponent.zone.run(() => this.movingState.x = value);
    }
  
    private set movingStateY(value: number) {
      this.statemachineviewComponent.zone.run(() => this.movingState.y = value);
    }
  
    constructor(statemachineviewComponent: StatemachineviewComponent, movingState: State) {
      super(statemachineviewComponent);
      this.movingState = movingState;
    }
  
    override onMouseUp(event: MouseEvent): void {
      this.movingState.innerCircleHovered = false;
      this.statemachineviewComponent.changeState(new DefaultState(this.statemachineviewComponent));
    }
  
    override onMouseMove(event: MouseEvent): void {
      const boundary = this.boundary;
      if (event.x > boundary.left + this.movingState.r && event.x < boundary.right - this.movingState.r) {
        this.movingStateX = event.clientX - boundary.left;
      }
      if (event.y > boundary.top + this.movingState.r && event.y < boundary.bottom - this.movingState.r) {
        this.movingStateY = event.clientY - boundary.top;
      }
    }
  }