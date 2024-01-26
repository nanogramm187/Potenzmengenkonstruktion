import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { FooterComponent } from "./footer/footer.component";
import { CoreComponent } from '../../statemachine/src/public-api'; 
import { StatemachineService } from '../../statemachine/src/lib/statemachine/statemachine.service';
import { MockStateMachine } from './mockmachine/MockStateMachine';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, HeaderComponent, ToolbarComponent, CoreComponent, FooterComponent]
})
export class AppComponent {
  title = 'endlicherautomat';

  constructor(public service: StatemachineService) {
    service.stateMachine = new MockStateMachine();
  }

}
