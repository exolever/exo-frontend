import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-video-display',
  templateUrl: './video-display.component.html',
  styleUrls: ['./video-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoDisplayComponent {
  @Input() video: any;
}
