import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { State } from "../../../statemachine/src/lib/statemachine/state";
import { MockStateEditDialogComponent } from "./mock-state-edit-dialog/mock-state-edit-dialog.component";
import { Transition } from "../../../statemachine/src/lib/statemachine/stateconnections/Transition";
import { MockTransition } from "./MockTransition";

export class MockState extends State {

    override makeTransition(destination: State): Transition {
        return new MockTransition(this, destination);
    }
    
    override openEditDialog(dialog: MatDialog): MatDialogRef<any, any> {
        return dialog.open(MockStateEditDialogComponent, { width: '250px', data: this });
    }

    override isDeterministic(): boolean {
        return true;
    }
}