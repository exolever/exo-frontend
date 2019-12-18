import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';

import { exoAreasSectionConfiguration } from '@shared/configs/exo-areas-section.config';
import { ConsultantModel } from '@applications/shared/models';

import { PROFILE_VIEW_CONFIG, ProfileViewConfig } from '../../profile-view.config';

@Component({
  selector: 'app-core-pillars',
  templateUrl: './core-pillars.component.html',
  styleUrls: ['./core-pillars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorePillarsComponent implements  OnChanges {

  selectedExoPillars: Array<any> = [];
  @Input() profileUser: ConsultantModel;

  constructor(
    @Inject(PROFILE_VIEW_CONFIG) public config: ProfileViewConfig
  ) {}

  ngOnChanges() {
    this.selectedExoPillars = exoAreasSectionConfiguration.filter(
      area => this.profileUser.getExoArea( area.code.toString() )
    );
  }

}
