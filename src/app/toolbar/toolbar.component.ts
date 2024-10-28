import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from '../../../statemachine/src/lib/menu/menu.component';
import { TestcasebuttonComponent } from '../../../statemachine/src/lib/testcasebutton/testcasebutton.component';
import { InputComponent } from '../../../statemachine/src/lib/input/input.component';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
//import { TapeControlsComponent } from './tape-controls/tape-controls.component';
import { MatDialog } from '@angular/material/dialog';
import { DfaTableComponent } from '../dfaTable/dfaTable.component';
import { TutorialDialogComponent } from '../tutorial-dialog/tutorial-dialog.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [
    //TapeControlsComponent,
    MenuComponent,
    TestcasebuttonComponent,
    MatToolbarModule,
    InputComponent,
    FormsModule,
  ],
})
export class ToolbarComponent {
  constructor(public dialog: MatDialog, public service: StatemachineService) {}

  /** 
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
  */

  // Opens the Tutorial dialog when called
  openTutorialTable() {
    const dialogRef = this.dialog.open(TutorialDialogComponent, {
      maxWidth: '70vw',
      maxHeight: '90vh',
    });
  }

  // Opens the DFA Table dialog when called
  openDfaTable() {
    const dialogRef = this.dialog.open(DfaTableComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
