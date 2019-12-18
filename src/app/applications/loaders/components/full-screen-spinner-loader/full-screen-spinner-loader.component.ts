import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-full-screen-spinner-loader',
  templateUrl: './full-screen-spinner-loader.component.html',
  styleUrls: ['./full-screen-spinner-loader.component.scss']
})
export class FullScreenSpinnerLoaderComponent {
  @Input() isGlobal: boolean;
}
