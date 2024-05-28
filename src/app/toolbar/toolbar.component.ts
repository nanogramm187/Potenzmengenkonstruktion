import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from '../../../statemachine/src/lib/menu/menu.component';
import { TestcasebuttonComponent } from '../../../statemachine/src/lib/testcasebutton/testcasebutton.component';
import { InputComponent } from '../../../statemachine/src/lib/input/input.component';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { TapeControlsComponent } from './tape-controls/tape-controls.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [TapeControlsComponent, MenuComponent, TestcasebuttonComponent, MatToolbarModule, InputComponent, FormsModule],
})
export class ToolbarComponent {
  constructor(public service: StatemachineService) {}

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
}
