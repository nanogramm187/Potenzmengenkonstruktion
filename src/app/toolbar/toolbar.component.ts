import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from '../../../statemachine/src/lib/menu/menu.component';
import { TestcasebuttonComponent } from '../../../statemachine/src/lib/testcasebutton/testcasebutton.component';
import { InputComponent } from '../../../statemachine/src/lib/input/input.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [MenuComponent, TestcasebuttonComponent, MatToolbarModule, InputComponent],
})
export class ToolbarComponent {
 
}
