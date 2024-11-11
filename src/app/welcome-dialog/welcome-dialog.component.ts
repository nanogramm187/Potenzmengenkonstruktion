import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [],
  templateUrl: './welcome-dialog.component.html',
  styleUrl: './welcome-dialog.component.scss',
})
export class WelcomeDialogComponent {
  constructor(public dialogRef: MatDialogRef<WelcomeDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
