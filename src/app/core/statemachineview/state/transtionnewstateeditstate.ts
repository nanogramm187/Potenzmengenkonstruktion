import { Edge } from "../../endlicherautomat/edge";
import { State } from "../../endlicherautomat/state";
import { StatemachineviewComponent } from "../statemachineview.component";
import { TransitionEditDialogComponent } from "../transition-edit-dialog/transition-edit-dialog.component";
import { DefaultState } from "./defaultstate";
import { StateMachineViewState } from "./statemachineviewstate";

export class TransitionNewStateEditState extends StateMachineViewState {

    transitionFrom: State;
    transitionTo: State;
    dummyTransition: Edge;
  
    constructor(
      statemachineviewComponent: StatemachineviewComponent, 
      transitionFrom: State,
      transitionTo: State)
    {
      super(statemachineviewComponent);
      this.transitionFrom = transitionFrom;
      this.transitionTo = transitionTo;
      this.dummyTransition = this.statemachineviewComponent.turingmachineService.addDummyTransition(transitionFrom, transitionTo);
  
      const dialogRef = this.statemachineviewComponent.dialog.open(TransitionEditDialogComponent, {
        width: '545px',
        autoFocus: false,
        data: {
          sourceState: this.transitionFrom,
          destinationState: this.transitionTo,
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.statemachineviewComponent.turingmachineService.deleteState(this.transitionTo);
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