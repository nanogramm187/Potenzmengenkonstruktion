import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockTransition } from '../MockTransition';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-mock-transition-edit-dialog',
  standalone: true,
  imports: [ MatIcon, CommonModule, MatFormFieldModule, FormsModule, MatInputModule ],
  templateUrl: './mock-transition-edit-dialog.component.html',
  styleUrl: './mock-transition-edit-dialog.component.scss'
})
export class MockTransitionEditDialogComponent {

  symbol: string = "";

  constructor(
    public dialogRef: MatDialogRef<MockTransitionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MockTransition) {
  }

  add(): void {
    this.data.symbols.push(this.symbol);
    this.symbol = "";
  }

  close(): void {
    this.dialogRef.close();
  }
}
