import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../statemachine/src/lib/header/header.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from '../../statemachine/src/lib/footer/footer.component';
import { CoreComponent } from '../../statemachine/src/public-api';
import { StatemachineService } from '../../statemachine/src/lib/statemachine/statemachine.service';
import { EndlicherAutomat } from './endlicherautomat/EndlicherAutomat';
import { InputTableComponent } from './inputTable/inputTable.component';
//import { TapeComponent } from './endlicherautomat/tape/tape.component';
import { DfaTableComponent } from './dfaTable/dfaTable.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    //TapeComponent,
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
export class AppComponent {
  title = 'endlicherautomat';

  constructor(public service: StatemachineService) {
    service.stateMachine = new EndlicherAutomat();
  }
}
