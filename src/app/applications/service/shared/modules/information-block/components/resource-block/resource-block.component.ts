import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InformationBlock } from '../../models/information-block.model';

@Component({
  selector: 'app-resource-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resource-block.component.html'
})
export class ResourceBlockComponent {

  @Input()
  resourceBlock: InformationBlock;

  constructor() { }
}
