import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Transition } from '../../../statemachine/src/lib/statemachine/stateconnections/Transition';
import { TransitionEditDialogComponent } from './transition-edit-dialog/transition-edit-dialog.component';
import { EndlicherState } from './EndlicherState';

export class EndlicheTransition extends Transition {
  override source: EndlicherState;
  override destination: EndlicherState;
  transitionSymbols: string[] = [];

  constructor(
    source: EndlicherState,
    destination: EndlicherState,
    // Optional array of symbols for the transition
    transitionSymbols?: string[]
  ) {
    super();
    this.source = source;
    this.destination = destination;
    // Initialize transition symbols or set to empty array
    this.transitionSymbols = transitionSymbols || [];
  }

  override displayText(): string[] {
    const result = this.transitionSymbols.join(', ');
    return result.length ? [result] : [];
  }

  override openTransitionDialog(dialog: MatDialog): MatDialogRef<any, any> {
    return dialog.open(TransitionEditDialogComponent, { data: this });
  }

  includesSymbol(symbol: string): boolean {
    return this.transitionSymbols.includes(symbol);
  }

  override toJSON(): Object {
    return {
      destination: this.destination.id,
      transitionSymbols: this.transitionSymbols,
    };
  }
}
