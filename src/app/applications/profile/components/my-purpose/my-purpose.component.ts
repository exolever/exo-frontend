import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ConsultantModel } from '@applications/shared/models';

@Component({
  selector: 'app-my-purpose',
  templateUrl: './my-purpose.component.html',
  styleUrls: ['./my-purpose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyPurposeComponent {

  @Input() profileUser: ConsultantModel;

}
