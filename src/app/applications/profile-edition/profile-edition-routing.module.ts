import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  ProfileEditionContainerComponent
} from './container/profile-edition-container/profile-edition-container.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AboutYouComponent } from './components/about-you/about-you.component';
import { YourPurposeComponent } from './components/your-purpose/your-purpose.component';
import { WantedActivitiesComponent } from './components/wanted-activities/wanted-activities.component';
import { CorePillarsComponent } from './components/core-pillars/core-pillars.component';
import { ExoFramerComponent } from './components/exo-framer/exo-framer.component';
import { OtherSkillsComponent } from './components/other-skills/other-skills.component';
import { PlatformProfileEditionGuard } from './services/edit-profile.guard';

const routes: Routes = [
  { path: '', component: ProfileEditionContainerComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'summary' },
      { path: 'summary', component: SummaryComponent, canDeactivate: [PlatformProfileEditionGuard] },
      { path: 'about-you', component: AboutYouComponent, canDeactivate: [PlatformProfileEditionGuard] },
      { path: 'your-purpose', component: YourPurposeComponent, canDeactivate: [PlatformProfileEditionGuard] },
      { path: 'desired-activities', component: WantedActivitiesComponent,
        canDeactivate: [PlatformProfileEditionGuard] },
      { path: 'core-pillars', component: CorePillarsComponent, canDeactivate: [PlatformProfileEditionGuard] },
      { path: 'exo-framer', component: ExoFramerComponent, canDeactivate: [PlatformProfileEditionGuard] },
      { path: 'other-skills', component: OtherSkillsComponent, canDeactivate: [PlatformProfileEditionGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PlatformProfileEditionGuard]
})
export class ProfileEditionRoutingModule { }
