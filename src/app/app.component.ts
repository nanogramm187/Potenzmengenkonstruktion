import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../statemachine/src/lib/header/header.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from '../../statemachine/src/lib/footer/footer.component';
import { CoreComponent } from '../../statemachine/src/public-api';
import { StatemachineService } from '../../statemachine/src/lib/statemachine/statemachine.service';
import { EndlicherAutomat } from './endlicherautomat/EndlicherAutomat';
import { InputTableComponent } from './inputTable/inputTable.component';
import { DfaTableComponent } from './dfaTable/dfaTable.component';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ToolbarComponent,
    CoreComponent,
    FooterComponent,
    InputTableComponent,
    DfaTableComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'endlicherautomat';

  constructor(public service: StatemachineService, public dialog: MatDialog) {
    service.stateMachine = new EndlicherAutomat();
  }

  ngOnInit(): void {
    this.dialog.open(WelcomeDialogComponent, {
      width: '70vh',
      height: '50vh',
    });
  }
}
