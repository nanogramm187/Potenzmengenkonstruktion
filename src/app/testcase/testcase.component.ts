import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StatemachineService } from '../../../statemachine/src/lib/statemachine/statemachine.service';
import { Testcase } from './testcase';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-testcase',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIcon,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './testcase.component.html',
  styleUrl: './testcase.component.scss',
})
export class TestcaseComponent {
  private testcases: Testcase[] = [];

  constructor(public service: StatemachineService) {}

  isDeterministic(): boolean {
    return this.service.isDeterministic();
  }

  isStartStateDefined(): boolean {
    return this.service.isStartStateDefined();
  }

  getTestcases(): Testcase[] {
    return this.testcases;
  }

  addAcceptingInput() {
    this.testcases.push(new Testcase());
  }

  removeAcceptingInput(index: number) {
    this.testcases.splice(index, 1);
  }
}
