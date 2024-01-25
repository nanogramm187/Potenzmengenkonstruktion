import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { State } from "../statemachine/state";
import { MockStateEditDialogComponent } from "./mock-state-edit-dialog/mock-state-edit-dialog.component";

export class MockState extends State {
    
    override openEditDialog(dialog: MatDialog): MatDialogRef<any, any> {
        return dialog.open(MockStateEditDialogComponent, { width: '250px', data: this });
    }

    override isDeterministic(): boolean {
        return true;
    }
}