import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';

import { PROFILE_VIEW_CONFIG, ProfileViewConfig } from '../../../profile-view.config';

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsListComponent {

  @Input() skills: Array<any>;
  @Input() maxSkillsLength: number;

  constructor(
    @Inject( PROFILE_VIEW_CONFIG ) public config: ProfileViewConfig
  ) {}

  /**
   * gets the max height of the skills container according to the skill set that has more values
   * so that the box can fit all tabs and the height of it is fixed instead of variable
   */
  getSkillListContainerHeight(): string {
    const heightOfSingleSkill = 59;
    const paddingToAdd = 20;
    return (heightOfSingleSkill * this.maxSkillsLength + paddingToAdd) + 'px';
  }

}
