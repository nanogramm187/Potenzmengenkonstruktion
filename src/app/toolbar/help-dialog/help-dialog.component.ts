import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabBody, MatTabGroup, MatTabHeader, MatTabLabel, MatTabLink, MatTabNav } from '@angular/material/tabs';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-help-dialog',
  standalone: true,
  imports: [ MatIcon, MatTabGroup, MatTab, MatTabBody, MatTabHeader, MatTabLabel, MatTabNav, MatTabLink , MatDialogClose],
  templateUrl: './help-dialog.component.html',
  styleUrl: './help-dialog.component.scss'
})
export class HelpDialogComponent {
  constructor() {}

  text: String = '';

  @ViewChildren('videoRef') videos!: QueryList<ElementRef>;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.playVideoAtIndex(0);
  }

  onTabChange(index: number): void {
    this.playVideoAtIndex(index);
  }

  private playVideoAtIndex(index: number): void {
    this.videos.forEach((vid, idx) => {
      const videoElement = vid.nativeElement as HTMLVideoElement;
      if (idx === index) {
        videoElement.play();
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    });
  }
}
