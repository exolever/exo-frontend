import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { InformationBlock } from '../../../models/information-block.model';

@Component({
  selector: 'app-advices-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './advices-block.component.html'
})
export class AdvicesBlockComponent {

  @Input()
  advicesBlock: InformationBlock;

  constructor() { }
}
