import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'exo-forum-icon',
  templateUrl: './forum-icon.component.html',
  styleUrls: ['./forum-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForumIconComponent {
  @Input() color: string;
  @Input() tooltip: string;
}
