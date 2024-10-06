import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';
import { CoreComponent } from 'statemachine/src/public-api';

@Component({
  selector: 'app-dfa-dialog',
  templateUrl: './dfa-dialog.component.html',
  standalone: true,
  imports: [CoreComponent],
})
export class DfaDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dfa: EndlicherAutomat }
  ) {}
}
