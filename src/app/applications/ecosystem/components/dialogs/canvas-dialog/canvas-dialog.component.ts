import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-canvas-dialog',
  templateUrl: './canvas-dialog.component.html',
  styleUrls: ['./canvas-dialog.component.scss']
})
export class CanvasDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CanvasDialogComponent>
  ) {}

  onDownloadSummary() {
    // Tracking: (ActionGA.DownloadCanvas, {
    //   label: CategoryGA.Landing,
    //   category: CategoryGA.Landing
    // });

    window.open('https://github.com/exoeconomy/ExO-Tool-Kit/blob/master/ExO-Canvas/ExOCanvas-EN-English.pdf',
      '_blank');
  }
}
