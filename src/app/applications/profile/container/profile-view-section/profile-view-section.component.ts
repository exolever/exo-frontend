import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { PROFILE_VIEW_CONFIG, ProfileViewConfig } from '@applications/profile/profile-view.config';

@Component({
  selector: 'app-profile-view-section',
  templateUrl: './profile-view-section.component.html',
  styleUrls: ['./profile-view-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileViewSectionComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() privateForYou = false;
  @Input() nonValidated = false;

  constructor(
    @Inject(PROFILE_VIEW_CONFIG) public config: ProfileViewConfig
  ) {}

}
