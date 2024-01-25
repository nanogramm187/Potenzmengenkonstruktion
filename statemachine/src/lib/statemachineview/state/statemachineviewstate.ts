import { Point } from "../../statemachine/drawingprimitives/Point";
import { State } from "../../statemachine/state";
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
    onInnerCircleMouseDown(event: MouseEvent, state: State): void {}
    onInnerCircleMouseUp(event: MouseEvent, state: State): void {}
    onOuterCircleMouseDown(event: MouseEvent, state: State): void {}
    onOuterCircleMouseUp(event: MouseEvent, state: State): void {}
    onEntireCircleMouseDown(event: MouseEvent, state: State): void {}
    onEntireCircleMouseUp(event: MouseEvent, state: State): void {}
    onCircleEnter(event: MouseEvent, state: State): void {}
    onCircleLeave(event: MouseEvent, state: State): void {}
    onInnerCircleEnter(event: MouseEvent, state: State): void {}
    onInnerCircleLeave(event: MouseEvent, state: State): void {}
    onOuterCircleEnter(event: MouseEvent, state: State): void {}
    onOuterCircleLeave(event: MouseEvent, state: State): void {}

    showStartConnection(state: State): boolean { return false }
    showEndConnection(state: State): boolean { return false }

    showDrawingTransition(): boolean { return false }
    drawingTransitionOrigin(): Point { return Point.zero }
    drawingTransitionDestination(): Point { return Point.zero }
}
