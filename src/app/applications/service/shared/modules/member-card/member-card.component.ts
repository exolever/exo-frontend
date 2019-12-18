import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { NavigationService } from '@shared/navigation/navigation.service';

import { MemberCardInterface } from './member-card.inteface';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberCardComponent {
  @Input() item: MemberCardInterface;
  @Input() loggedUserisStaff = false;
  constructor(public pnService: NavigationService) {}

  // HACK. Fix error of tooltips.
  // https://stackoverflow.com/questions/49633413/angular-material-mattooltip-does-not-display-when-using-ngfor-function
  trackByFn = (index: number, item: any) => index;
}
