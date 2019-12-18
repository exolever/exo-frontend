import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import {getStringEnum} from '@shared/helpers/enum.helper';

import { ProfileHelpPopoverEnum } from '../../../enums/profile-help-popover.enum';

@Component({
  selector: 'app-chart-help-popover',
  templateUrl: './chart-help-popover.component.html',
  styleUrls: ['./chart-help-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartHelpPopoverComponent implements OnInit {
  @Input() label: string;
  @Input() positionInList: number;
  /** config params */
  @Input() xPosition = 'after';
  @Input() yPosition = 'below';

  helpPopoverEnum: any;

  ngOnInit() { this.helpPopoverEnum = ProfileHelpPopoverEnum; }

  /**
   * gets the type of popover to display title and text
   * @param {string} name: the name of the popover
   * @returns {string} the text of the popover from an enumerate type
   */
  getHelpPopoverType( name: string ): string {
    return getStringEnum( ProfileHelpPopoverEnum, name );
  }

}
