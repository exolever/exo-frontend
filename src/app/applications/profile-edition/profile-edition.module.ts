import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// store
import { reducers } from '@applications/profile/store/user-profile.reducer';
import { ProfileEffect } from '@applications/profile/store/user-profile.effect';

// modules
import { ProfileEditionRoutingModule } from './profile-edition-routing.module';
import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';

// Container
import {
  ProfileEditionContainerComponent
} from './container/profile-edition-container/profile-edition-container.component';

// Components
import { AboutYouComponent } from './components/about-you/about-you.component';
import { AutocompleteLevelComponent } from './components/other-skills/autocomplete-level/autocomplete-level.component';
import { CorePillarsComponent } from './components/core-pillars/core-pillars.component';
import { ExoFramerComponent } from './components/exo-framer/exo-framer.component';
import {
  ProfileHelpPopoverComponent
} from './components/exo-framer/profile-help-popover/profile-help-popover.component';
import { OtherSkillsComponent } from './components/other-skills/other-skills.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { SliderHintComponent } from './components/exo-framer/slider-hint/slider-hint.component';
import { SummaryComponent } from './components/summary/summary.component';
import { WantedActivitiesComponent } from './components/wanted-activities/wanted-activities.component';
import { YourPurposeComponent } from './components/your-purpose/your-purpose.component';
import {
  ShareProfileDialogComponent
} from '@profile-edition/dialogs/share-profile-dialog/share-profile-dialog.component';

// services
import { ProfileEditSnackBarService } from './services/snack-bar.service';
import { ProfileEditionService } from './services/profile-edition.service';

// Shared
import { ProfileSharedModule } from './shared/profile-shared.module';
import { CropperComponent } from '@shared/components/cropper/cropper.component';
import { ProfileVideoComponent } from './components/about-you/profile-video/profile-video.component';
import { FilestackService } from '@core/services/filestack.service';
import { ProfileViewConfigProvider } from '@applications/profile/profile-view.config';

@NgModule({
  imports: [
    SharedModule,
    ProfileEditionRoutingModule,
    LoaderModule,
    StoreModule.forFeature('profile', reducers),
    EffectsModule.forFeature([ProfileEffect]),
    ProfileSharedModule
  ],
  declarations: [
    AboutYouComponent,
    AutocompleteLevelComponent,
    CorePillarsComponent,
    ExoFramerComponent,
    ProfileHelpPopoverComponent,
    OtherSkillsComponent,
    ProfileEditionContainerComponent,
    ProfileVideoComponent,
    SideNavigationComponent,
    SliderHintComponent,
    SummaryComponent,
    WantedActivitiesComponent,
    YourPurposeComponent,
    ShareProfileDialogComponent,
  ],
  providers: [
    ProfileEditionService,
    FilestackService,
    ProfileEditSnackBarService,
    ProfileViewConfigProvider,
    CropperComponent,
  ],
  entryComponents: [
    ShareProfileDialogComponent,
  ],
})
export class ProfileEditionModule { }
