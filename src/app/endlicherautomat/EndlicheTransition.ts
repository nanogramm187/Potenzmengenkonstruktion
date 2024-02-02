import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Transition } from "../../../statemachine/src/lib/statemachine/stateconnections/Transition";
import { TransitionEditDialogComponent } from "./transition-edit-dialog/transition-edit-dialog.component";
import { EndlicherState } from "./EndlicherState";

export class EndlicheTransition extends Transition {

    override source: EndlicherState;
    override destination: EndlicherState;

    constructor(source: EndlicherState, destination: EndlicherState) {
        super();
        this.source = source;
        this.destination = destination;
    }

    transitionSymbols: string[] = []

    override displayText(): string[] {
        return [this.transitionSymbols.join(", ")];
    }

    override openTransitionDialog(dialog: MatDialog): MatDialogRef<any, any> {
        return dialog.open(TransitionEditDialogComponent, { width: '250px', data: this });
    }

    includesSymbol(symbol: string): boolean {
        return this.transitionSymbols.includes(symbol);
    }
}