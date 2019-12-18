import { NgModule } from '@angular/core';

import { PolarChartModule, PieChartModule } from '@swimlane/ngx-charts';

// MODULE CONF
import { ProfileViewConfigProvider } from '@applications/profile/profile-view.config';

// STORE
import { reducers } from './store/user-profile.reducer';
import { ProfileEffect } from './store/user-profile.effect';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// MODULES
import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';
import { BreadcrumbModule } from '@applications/breadcrumb/breadcrumb.module';
import { MailboxModule } from '@ecosystem/modules/mailbox/mailbox.module';
import { OverlayModule } from '@overlay/overlay.module';
import { CommunicationModule } from '@applications/shared/communication/communication.module';
import { CertificatesModule } from '@applications/certificates/certificates.module';

// SERVICES
import {
  UserAndConsultantResponseDigestService
} from '@applications/profile/services/user-and-consultant-response-digest.service';
import { AccountUserService } from '@applications/profile/services/account.service';
import { ChangeEmailService } from '@applications/profile/services/change-email.service';
import { ProfileEditSnackBarService } from '@applications/profile-edition/services/snack-bar.service';
import { ChangePasswordService } from '@applications/profile/services/change-password.service';
import { ChangeLanguageService } from '@applications/profile/services/change-language.service';
import { ChangeContractingService } from '@applications/profile/services/change-contracting.service';
import { ProfileConsultantRolesService } from './services/profile-consultant-roles.service';
import { CopyToClipboardService } from './services/copy-to-clipboard.service';

// CONTAINER
import { ProfileContainerComponent } from './container/profile-container/profile-container.component';

// COMPONENTS
import { AccountComponent } from './components/account/account.component';
import { CorePillarsComponent } from './components/core-pillars/core-pillars.component';
import { MyPurposeComponent } from './components/my-purpose/my-purpose.component';
import { MySkillsComponent } from './components/my-skills/my-skills.component';
import { OtherSkillsComponent } from './components/other-skills/other-skills.component';
import { PictureAboutComponent } from './components/picture-about/picture-about.component';
import { PlatformChangeEmailComponent } from './components/account/change-email/platform-change-email.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SkillsListComponent } from './components/other-skills/skills-list/skills-list.component';
import { SkillsChartComponent } from './components/my-skills/skills-chart/skills-chart.component';
import { VideoMeComponent } from './components/video-me/video-me.component';
import { VideoDisplayComponent } from './components/video-me/video-display/video-display.component';
import { ProfileViewSectionComponent } from './container/profile-view-section/profile-view-section.component';
import { ChartHelpPopoverComponent } from './components/my-skills/chart-help-popover/chart-help-popover.component';
import { ProfileEditButtonComponent } from './common/profile-edit-button/profile-edit-button.component';
import {
  ProfileEmptyMomentSectionComponent
} from './container/profile-empty-moment-section/profile-empty-moment-section.component';
import { CertificationComponent } from './components/certifications/certifications.component';
import { BadgesComponent } from './components/badges/badges.component';
import { BadgesChartComponent } from './components/badges/badges-chart/badges-chart.component';
import { BadgeDetailDialogComponent } from './components/badges/badge-detail-dialog/badge-detail-dialog.component';
import { BADGES_CONFIG, badgesConfig } from './components/badges/badges.conf';

@NgModule({
  imports: [
    SharedModule,
    CertificatesModule,
    PolarChartModule,
    PieChartModule,
    LoaderModule,
    ProfileRoutingModule,
    BreadcrumbModule,
    MailboxModule,
    OverlayModule,
    CommunicationModule,
    StoreModule.forFeature('profile', reducers),
    EffectsModule.forFeature([ProfileEffect]),
  ],
  declarations: [
    AccountComponent,
    ChartHelpPopoverComponent,
    CorePillarsComponent,
    MyPurposeComponent,
    MySkillsComponent,
    OtherSkillsComponent,
    PictureAboutComponent,
    PlatformChangeEmailComponent,
    ProfileContainerComponent,
    ProfileEditButtonComponent,
    ProfileViewSectionComponent,
    SkillsChartComponent,
    SkillsListComponent,
    VideoDisplayComponent,
    VideoMeComponent,
    ProfileEmptyMomentSectionComponent,
    CertificationComponent,
    BadgesComponent,
    BadgesChartComponent,
    BadgeDetailDialogComponent
  ],
  providers: [
    AccountUserService,
    ChangeContractingService,
    ChangeEmailService,
    ChangeLanguageService,
    ChangePasswordService,
    ProfileConsultantRolesService,
    ProfileEditSnackBarService,
    ProfileViewConfigProvider,
    UserAndConsultantResponseDigestService,
    CopyToClipboardService,
    {provide: BADGES_CONFIG, useValue: badgesConfig},
  ],
  entryComponents: [
    PlatformChangeEmailComponent,
    BadgeDetailDialogComponent,
  ]
})
export class ProfileModule { }
