import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slider-hint',
  templateUrl: './slider-hint.component.html'
})
export class SliderHintComponent {
  @Input() value: string;
}
