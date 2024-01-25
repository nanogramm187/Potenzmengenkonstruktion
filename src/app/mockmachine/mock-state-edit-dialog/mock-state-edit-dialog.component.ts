import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockState } from '../MockState';
import { MatIcon } from '@angular/material/icon';
import { StatemachineService } from '../../../../statemachine/src/lib/statemachine.service';

@Component({
  selector: 'app-mock-state-edit-dialog',
  standalone: true,
  imports: [ MatIcon ],
  templateUrl: './mock-state-edit-dialog.component.html',
  styleUrl: './mock-state-edit-dialog.component.scss'
})
export class MockStateEditDialogComponent {
  
    constructor(
      public dialogRef: MatDialogRef<MockStateEditDialogComponent>,
      public statemachineService: StatemachineService,
      @Inject(MAT_DIALOG_DATA) public data: MockState) {
    }
    
    delete(): void {
      this.statemachineService.deleteState(this.data);
      this.dialogRef.close(true);
    }

    close(): void {
      this.dialogRef.close(true);
    }
}
