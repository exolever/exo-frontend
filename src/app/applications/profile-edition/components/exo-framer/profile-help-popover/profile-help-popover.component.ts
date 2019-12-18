import { Component, Input } from '@angular/core';
import { ProfileHelpPopoverEnum } from '@profile/enums/profile-help-popover.enum';

@Component({
  selector: 'app-profile-help-popover',
  templateUrl: './profile-help-popover.component.html',
  styleUrls: ['./profile-help-popover.component.scss']
})
export class ProfileHelpPopoverComponent {
  @Input() type: string;
  @Input() xPosition = 'after';
  @Input() yPosition = 'below';

  // To configure different colors, and icon size
  @Input() color = 'accent';
  @Input() iconSize = 'mat-16';

  public helpPopoverEnum = ProfileHelpPopoverEnum;
}
