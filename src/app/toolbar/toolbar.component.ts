import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from '../../../statemachine/src/lib/menu/menu.component';
import { TestcasebuttonComponent } from '../../../statemachine/src/lib/testcasebutton/testcasebutton.component';
import { InputComponent } from '../../../statemachine/src/lib/input/input.component';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { TapeControlsComponent } from './tape-controls/tape-controls.component';
import { MatDialog } from '@angular/material/dialog';
import { DfaDialogComponent } from '../dfa-dialog/dfa-dialog.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [
    TapeControlsComponent,
    MenuComponent,
    TestcasebuttonComponent,
    MatToolbarModule,
    InputComponent,
    FormsModule,
  ],
})
export class ToolbarComponent {
  constructor(public dialog: MatDialog, public service: StatemachineService) {}

  get title(): string {
    return this.service.stateMachine.title;
  }

  set title(title: string) {
    this.service.stateMachine.title = title;
  }

  get description(): string {
    return this.service.stateMachine.description;
  }

  set description(description: string) {
    this.service.stateMachine.description = description;
  }

  openDfaDialog() {
    const dialogRef = this.dialog.open(DfaDialogComponent, {
      maxWidth: '90vw', // Set max-width to prevent the dialog from being too wide
      maxHeight: '90vh', // Set max-height to prevent overflow
      autoFocus: false, // Prevents the dialog from auto-scrolling to an input field
    });
  }
}
