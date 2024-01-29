import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Transition } from "../../../statemachine/src/lib/statemachine/stateconnections/Transition";
import { TransitionEditDialogComponent } from "./transition-edit-dialog/transition-edit-dialog.component";

export class EndlicheTransition extends Transition {

    transitionSymbols: string[] = []

    override displayText(): string[] {
        return [this.transitionSymbols.join(", ")];
    }

    override openTransitionDialog(dialog: MatDialog): MatDialogRef<any, any> {
        return dialog.open(TransitionEditDialogComponent, { width: '250px', data: this });
    }
}