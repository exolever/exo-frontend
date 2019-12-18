import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';
import { PROFILE_VIEW_CONFIG, ProfileViewConfig } from '../../profile-view.config';

@Component({
  selector: 'app-other-skills',
  templateUrl: './other-skills.component.html',
  styleUrls: ['./other-skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherSkillsComponent implements OnChanges {

  maxSkillsLength = 0;
  @Input() skills: Array<{ label: string, data: Array<any> }> = [];

  constructor(
    @Inject(PROFILE_VIEW_CONFIG) public config: ProfileViewConfig
  ) {}

  ngOnChanges() {
    this.maxSkillsLength = Math.max( ...this.skills.map( skill => skill.data.length ) );
  }

}
