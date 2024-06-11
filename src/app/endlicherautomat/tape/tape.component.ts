import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { NgFor } from '@angular/common';
import { StatemachineService } from '../../../../statemachine/src/lib/statemachine/statemachine.service';
import { TapeService } from '../../toolbar/tape-controls/tape.service';

@Component({
    selector: 'app-tape',
    templateUrl: './tape.component.html',
    styleUrls: ['./tape.component.css'],
    standalone: true,
    imports: [NgFor]
})
export class TapeComponent implements AfterViewInit {
  @Input() animate!: boolean;

  readonly cellWidth: number = 50;
  readonly cellHeight: number = 50;

  get splitPosition(): number {
    return this.tapeService.splitPosition;
  }

  get visibleCells(): number {
    let tapeViewWidth = this.elRef.nativeElement.offsetWidth;
    let berechneteAnzahl = Math.floor(tapeViewWidth / this.cellWidth);

    // Sicherstellen, dass die Anzahl ungerade ist
    if (berechneteAnzahl % 2 === 0) {
      return berechneteAnzahl > 0 ? berechneteAnzahl + 1 : 1;
    } else {
      return berechneteAnzahl;
    }
  }

  get allCells(): number {
    return this.visibleCells + 2;
  }

  get centerCellIndex(): number {
    return Math.floor(this.allCells / 2);
  }

  get viewboxWidth(): number {
    return this.visibleCells * this.cellWidth;
  }

  get indices(): number[] {
    const indices = [];
    for (let i = 0; i < this.allCells; i++) {
      indices.push(i);
    }
    return indices;
  }

  constructor(
    private elRef: ElementRef, 
    private service: StatemachineService, 
    private tapeService: TapeService,
    private ref: ChangeDetectorRef, 
    private appRef: ApplicationRef) {
    this.service.testcaseViewToggled = (() => this.appRef.tick());
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => this.ref.detectChanges());
  }

  // Calculates the relative index for each tape cell
  tapeIndex(index: number): number {
    return (index + this.splitPosition) - this.centerCellIndex;
  }

  tapeNumber(index: number): number {
    return (index + this.splitPosition) - this.centerCellIndex;
  }

  center(): number {
    return (this.centerCellIndex * this.cellWidth - this.cellWidth)
  }

  // Calculates the X position of a cell
  cellXPosition(index: number): number {
    return index * this.cellWidth - this.cellWidth;
  }

  // Calculates the middle X position of a cell
  cellMidXPosition(index: number): number {
    return index * this.cellWidth - this.cellWidth / 2;
  }

  contentAtIndex(index: number): string {
    const tapecontent = this.service.stateMachine._input;
    const tapeNumber = this.tapeNumber(index);
    if (tapeNumber >= 0 && tapeNumber < tapecontent.length) {
      return tapecontent[tapeNumber];
    } else {
      return '';
    }
  }
}