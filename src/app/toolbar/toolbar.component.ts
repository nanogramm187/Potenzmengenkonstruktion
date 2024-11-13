import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from '../../../statemachine/src/lib/menu/menu.component';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { MatDialog } from '@angular/material/dialog';
import { DfaTableComponent } from '../dfaTable/dfaTable.component';
import { TutorialDialogComponent } from '../tutorial-dialog/tutorial-dialog.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [MenuComponent, MatToolbarModule, FormsModule],
})
export class ToolbarComponent {
  constructor(public dialog: MatDialog, public service: StatemachineService) {}

  // Opens the Tutorial dialog when called
  openTutorialTable() {
    this.dialog.open(TutorialDialogComponent, {
      maxWidth: '70vw',
      maxHeight: '90vh',
    });
  }

  // Opens the DFA Table dialog when called
  openDfaTable() {
    this.dialog.open(DfaTableComponent, {
      minWidth: '50vh',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
