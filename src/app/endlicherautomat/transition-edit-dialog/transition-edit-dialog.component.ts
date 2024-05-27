import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EndlicheTransition } from '../EndlicheTransition';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transition-edit-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIcon, CommonModule, MatFormFieldModule, FormsModule, MatInputModule, MatTableModule, MatDialogModule],
  templateUrl: './transition-edit-dialog.component.html',
  styleUrl: './transition-edit-dialog.component.scss'
})
export class TransitionEditDialogComponent implements OnInit {

  newSymbol = '';

  private get firstField(): HTMLElement | null  {
    return document.getElementById('modalinput');
  }

  constructor(
    public dialogRef: MatDialogRef<TransitionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EndlicheTransition) {
    this.dialogRef.backdropClick().subscribe(() => this.closeModal());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.newSymbol.length > 0) {
        this.addRow();
        e.preventDefault();
      }
    });
  }

  ngOnInit(): void {
    this.firstField?.focus();
  }

  addRow() {
    if (this.newSymbol == '') {
      return;
    }
    this.data.transitionSymbols = [...this.data.transitionSymbols, this.newSymbol]
    this.reset();
  }

  removeRow(index: number) {
    this.data.transitionSymbols.splice(index, 1);
    this.data.transitionSymbols = [...this.data.transitionSymbols]
  }

  reset() {
    this.newSymbol = '';
    this.firstField?.focus();
  }

  closeModal() {
    this.dialogRef.close(this.data.isEmpty());
  }
}
