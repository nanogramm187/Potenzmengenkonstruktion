import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { State } from "../statemachine/state";

export class MockState extends State {

    override openEditDialog(dialog: MatDialog): MatDialogRef<any, any> {
        throw new Error("Method not implemented.");
    }

    override isDeterministic(): boolean {
        throw true;
    }
}