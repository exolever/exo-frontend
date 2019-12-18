import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';

import { SharedModule } from '@shared/shared.module';
import { ExOAvatarModule } from '@openexo/design-system';
import {
  OpportunitiesAdminService
} from '@ecosystem/modules/opportunities/modules/admin/service/opportunities-admin.service';
import { OpportunitiesSharedModule } from '@ecosystem/modules/opportunities/shared/opportunities-shared.module';
import {
  ManagementOpportunitiesActionsService
} from '@ecosystem/modules/opportunities/shared/services/management-opportunities-actions.service';
import { LoaderModule } from '@loaders/loader.module';
import { BreakPointModule } from '@applications/break-point/break-point.module';

import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';
import { CommunicationModule } from '@applications/shared/communication/communication.module';
import { ApplicantListComponent } from './components/applicant-list/applicant-list.component';
import { RecipientsComponent } from './components/recipients/recipients.component';
import { OpportunityInfoComponent } from './components/opportunity-info/opportunity-info.component';
import { ApplicantsStatusCardComponent } from './components/applicants-status-card/applicants-status-card.component';
import { OpportunitiesAdminComponent } from './container/opportunities-admin/opportunities-admin.component';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { SowContainerComponent } from './components/sow/sow-container/sow-container.component';
import { SowFormComponent } from './components/sow/sow-form/sow-form.component';
import { SowProgressComponent } from './components/sow/sow-progress/sow-progress.component';
import { SowConfirmationComponent } from './components/sow/sow-confirmation/sow-confirmation.component';
import { OpportunityFeedbackComponent } from './container/opportunity-feedback/opportunity-feedback.component';

const routes: Routes = [
  {
    path: '',
    component: OpportunitiesAdminComponent,
    children : [
      {
        path: '',
        redirectTo: 'applicants',
        pathMatch: 'full'
      },
      {
        path: 'recipients',
        component: RecipientsComponent
      },
      {
        path: 'applicants',
        component: ApplicantListComponent
      },
      {
        path: 'conversations',
        component: ConversationsComponent
      },
      {
        path: 'feedback',
        component: OpportunityFeedbackComponent,
      },
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    LoaderModule,
    LayoutModule,
    OpportunitiesSharedModule,
    RouterModule.forChild(routes),
    ExOAvatarModule,
    CustomMd2DatepickerModule,
    CommunicationModule,
    BreakPointModule,
  ],
  declarations: [
    OpportunitiesAdminComponent,
    ApplicantListComponent,
    RecipientsComponent,
    OpportunityInfoComponent,
    ApplicantsStatusCardComponent,
    ConversationsComponent,
    ConfirmationDialogComponent,
    SowContainerComponent,
    SowProgressComponent,
    SowFormComponent,
    SowConfirmationComponent,
    OpportunityFeedbackComponent,
  ],
  providers: [
    OpportunitiesAdminService,
    ManagementOpportunitiesActionsService,
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    SowContainerComponent,
  ]
})
export class OpportunitiesAdminModule { }
