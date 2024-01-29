import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { State } from "../../../statemachine/src/lib/statemachine/state";
import { Transition } from "../../../statemachine/src/lib/statemachine/stateconnections/Transition";
import { EndlicheTransition } from "./EndlicheTransition";

export class EndlicherState extends State {
    override makeTransition(destination: State): Transition {
        return new EndlicheTransition(this, destination);
    }
    override openEditDialog(dialog: MatDialog): MatDialogRef<any, any> {
        throw new Error("Method not implemented.");
    }
    override isDeterministic(): boolean {
        return true;
    }
}