import { Component } from '@angular/core';

@Component({
  selector: 'app-tools-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  download() {
    window.open('https://github.com/exoeconomy/ExO-Tool-Kit/blob/master/ExO-Canvas/ExOCanvas-EN-English.pdf', '_blank');
  }
}

