import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-advice-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './advice-item.component.html',
  styleUrls: ['./advice-item.component.scss']
})
export class AdviceItemComponent {

  @Input()
  advice: any;

}
