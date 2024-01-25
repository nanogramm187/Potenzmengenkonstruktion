import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Label } from "../statemachine/stateconnections/Label";
import { Transition } from "../statemachine/stateconnections/Transition";
import { MockTransitionEditDialogComponent } from "./mock-transition-edit-dialog/mock-transition-edit-dialog.component";

export class MockTransition extends Transition {
    

    symbols: string[] = [];

    override isEmpty(): boolean {
        return this.symbols.length === 0;
    }
    
    override openTransitionDialog(dialog: MatDialog): MatDialogRef<any, any> {
        return dialog.open(MockTransitionEditDialogComponent, { width: '250px', data: this });
    }

    override displayText(): string[] {
        return this.symbols;
    }
}