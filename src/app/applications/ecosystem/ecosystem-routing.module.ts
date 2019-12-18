import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Error410Component } from '@shared/components/error-410/error-410.component';

import { EcosystemComponent } from './containers/ecosystem.component';
import { ConsentComponent } from './components/consent/consent.component';
import {
  FirstLevelCertificationComponent
} from './components/first-level-certification/first-level-certification.component';
import { MarketplaceAgreementGuard } from './marketplace-agreement.guard';
import { MarketplaceConditionsComponent } from './components/marketplace-conditions/marketplace-conditions.component';
import { EventParams } from '@core/enums/analytics.enum';


const routesEcosystem: Routes = [
  {
    path: 'consent',
    component: ConsentComponent
  },
  {
    path: '',
    component: EcosystemComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'circles'
      },
      {
        path: 'directory',
        loadChildren: () =>
          import('./modules/directory/directory.module').then(m => m.DirectoryEcosystemModule),
      },
      {
        path: 'opportunities',
        loadChildren: () =>
          import('./modules/opportunities/opportunities.module').then(m => m.OpportunitiesModule),
        canActivateChild: [MarketplaceAgreementGuard]
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./modules/events/events.module').then(m => m.EventsModule),
      },
      {
        path: 'announcements',
        loadChildren: () =>
          import('../circles/circles.module').then(m => m.CirclesModule),
      },
      {
        path: 'circles',
        loadChildren: () =>
          import('../circles/circles.module').then(m => m.CirclesModule),
      },
      {
        path: 'workspace',
        loadChildren: () =>
          import('../workspace/workspace.module').then(m => m.WorkspaceModule),
      },
      {
        path: 'questions',
        loadChildren: () =>
          import('../circles/circles.module').then(m => m.CirclesModule),
      },
      {
        path: 'media',
        loadChildren: () =>
          import('../ecosystem-media-library/ecosystem-media-library.module').then(m => m.EcosystemMediaLibraryModule)
      },
      {
        path: 'resources',
        loadChildren: () =>
          import('./modules/resources/resources.module').then(m => m.ResourcesModule)
      },
      {
        path: 'tools',
        loadChildren: () =>
          import('./modules/tools/tools.module').then(m => m.ToolsModule)
      },
      {
        path: 'jobs',
        loadChildren: () =>
          import('../my-jobs/my-jobs.module').then(m => m.MyJobsModule),
      },
      {
        path: 'certifications',
        loadChildren: () =>
          import('./modules/certifications/certifications.module').then(m => m.CertificationsModule)
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('../profile-edition/profile-edition.module').then(m => m.ProfileEditionModule),
      },
      {
        path: 'marketplace-conditions',
        component: MarketplaceConditionsComponent
      },
      {
        path: 'advisor-certification', // Link shared directly, keep consistency
        redirectTo: 'first-level-certification?source=' + EventParams.INTERCOM,
      },
      {
        path: 'first-level-certification',
        component: FirstLevelCertificationComponent
      },
      {
        path: 'mailbox',
        loadChildren: () =>
          import('./modules/mailbox/mailbox.module').then(m => m.MailboxModule)
      },
      {
        path: 'referrals',
        loadChildren: () =>
          import( '../early-parrot/early-parrot.module').then(m => m.EarlyParrotModule)
      },
      { path: 'error-410', component: Error410Component },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routesEcosystem)],
  exports: [RouterModule]
})
export class EcosystemRoutingModule { }
