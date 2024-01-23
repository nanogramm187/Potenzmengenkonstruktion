import { Point } from "../../endlicherautomat/drawingprimitives/Point";
import { TuringState } from "../../endlicherautomat/turingstate";
import { StatemachineviewComponent } from "../statemachineview.component";

export abstract class StateMachineViewState {

  protected statemachineviewComponent: StatemachineviewComponent;

    protected get boundary(): DOMRect {
      return this.statemachineviewComponent.svgFieldElementRef.nativeElement.getBoundingClientRect() as DOMRect;
    }

    constructor(statemachineviewComponent: StatemachineviewComponent) {
        this.statemachineviewComponent = statemachineviewComponent;
    }

    changeState(state: StateMachineViewState) {
      this.statemachineviewComponent.changeState(state);
    }

    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onMouseMove(event: MouseEvent): void {}
    onInnerCircleMouseDown(event: MouseEvent, state: TuringState): void {}
    onInnerCircleMouseUp(event: MouseEvent, state: TuringState): void {}
    onOuterCircleMouseDown(event: MouseEvent, state: TuringState): void {}
    onOuterCircleMouseUp(event: MouseEvent, state: TuringState): void {}
    onEntireCircleMouseDown(event: MouseEvent, state: TuringState): void {}
    onEntireCircleMouseUp(event: MouseEvent, state: TuringState): void {}
    onCircleEnter(event: MouseEvent, state: TuringState): void {}
    onCircleLeave(event: MouseEvent, state: TuringState): void {}
    onInnerCircleEnter(event: MouseEvent, state: TuringState): void {}
    onInnerCircleLeave(event: MouseEvent, state: TuringState): void {}
    onOuterCircleEnter(event: MouseEvent, state: TuringState): void {}
    onOuterCircleLeave(event: MouseEvent, state: TuringState): void {}

    showStartConnection(state: TuringState): boolean { return false }
    showEndConnection(state: TuringState): boolean { return false }

    showDrawingTransition(): boolean { return false }
    drawingTransitionOrigin(): Point { return Point.zero }
    drawingTransitionDestination(): Point { return Point.zero }
}
