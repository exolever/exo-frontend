import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sow-progress',
  templateUrl: './sow-progress.component.html',
  styleUrls: ['./sow-progress.component.scss']
})
export class SowProgressComponent {
  @Input() value: number;
}
