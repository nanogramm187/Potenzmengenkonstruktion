import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StatemachineService } from '../../../../statemachine/src/lib/statemachine/statemachine.service';
import { TapeService } from './tape.service';

@Component({
    selector: 'app-tape-controls',
    templateUrl: './tape-controls.component.html',
    styleUrls: ['./tape-controls.component.css'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})
export class TapeControlsComponent implements OnInit {

  constructor(public service: TapeService) { }

  ngOnInit(): void {}

  skipToEnd() {
    this.service.skipToEnd();
  }

  nextStep() {
    this.service.nextStep();
  }

  reset() {
    this.service.reset();
  }

  hasPreviousStep(): boolean {
    return this.service.hasPreviousStep();
  }

  previousStep() {
    this.service.previousStep();
  }

  hasNextStep(): boolean {
    return this.service.hasNextStep();
  }
}
