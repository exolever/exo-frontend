import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import {
  OpportunitiesAllComponent
} from './components/opportunities-all/opportunities-all.component';
import {
  OpportunityDetailComponent
} from './components/opportunity-detail/opportunity-detail.component';
import { OpportunitiesComponent } from './container/opportunities.component';
import {
  OpportunitiesByYouComponent
} from './components/opportunities-by-you/opportunities-by-you.component';
import { OpportunityFormLayoutComponent } from './components/opportunity-form-layout/opportunity-form-layout.component';
import { OpportunitiesGuard } from './modal-save-changes.guard';
import { OpportunityChatComponent } from '@opportunities/components/opportunity-chat/opportunity-chat.component';
import { ApplicantFeedbackComponent } from '@opportunities/components/applicant-feedback/applicant-feedback.component';


const routesOpportunities: Routes = [
  {
    path: '',
    component: OpportunitiesComponent,
    children : [
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
      },
      {
        path: 'all',
        component: OpportunitiesAllComponent
      },
      {
        path: 'admin',
        component: OpportunitiesByYouComponent
      }
    ]
  },
  {
    path: 'new',
    component: OpportunityFormLayoutComponent,
    canDeactivate: [OpportunitiesGuard]
  },
  {// Old tickets are redirect into opportunities list
    path: 'advisory-call/:pk',
    redirectTo: ':pk/chat',
  },
  {
    path: ':pk',
    component: OpportunityDetailComponent,
    children: [
      {
        path: '',
        redirectTo: 'chat',
        pathMatch: 'full'
      },
      {
        path: 'chat',
        component: OpportunityChatComponent
      },
      {
        path: 'feedback',
        component: ApplicantFeedbackComponent
      }
    ],
  },
  {
    path: 'admin',
    children : [
      {
        path: ':pk',
        loadChildren: () => import('./modules/admin/opportunities-admin.module').then(m => m.OpportunitiesAdminModule),
      },
      {
        path: 'edit/:pk',
        component: OpportunityFormLayoutComponent,
        canDeactivate: [OpportunitiesGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routesOpportunities)],
  exports: [RouterModule],
  providers: []
})
export class OpportunitiesRoutingModule { }
