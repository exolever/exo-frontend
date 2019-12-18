import { Component, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-help-popover',
  templateUrl: './help-popover.component.html',
  styleUrls: ['./help-popover.component.scss']
})
export class HelpPopoverComponent {
  @Input() title = this.translate.instant('POPOVER.TITLE');
  @Input() content: string;
  @Input() htmlContent?: string;
  @Input() xPosition = 'after';
  @Input() yPosition = 'below';
  @Input() trigger = 'click';
  @Input() delay = 400;

  constructor(private translate: TranslateService) {}
}
