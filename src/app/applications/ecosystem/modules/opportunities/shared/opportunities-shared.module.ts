import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material';

import { ExoCommonModule } from '@shared/exo-common.module';

import { CloseDialogComponent } from '@opportunities/shared/components/close/close-dialog.component';
import { ExoAlertModule } from '@openexo/design-system';
import { OverlayModule } from '@overlay/overlay.module';
import { SharedModule } from '@shared/shared.module';
import { BreakPointModule } from '@applications/break-point/break-point.module';
import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';

import {
  OpportunityMenuActionsComponent
} from './components/opportunity-menu-actions/opportunity-menu-actions.component';
import {
  ManagementOpportunitiesActionsService
} from './services/management-opportunities-actions.service';
import {
  ManagementOpportunityFormService
} from './services/management-opportunity-form.service';
import { OpportunitiesSerializerService } from './services/opportunities-serializer.service';
import { OpportunitiesFeedbackService } from './services/opportunities-feedback.service';
import { SowService } from './services/management-sow.service';
import { SowDeserializerService } from './services/sow-deserializer.service';
import { ViewSowComponent } from './components/view-sow/view-sow.component';
import {
  OpportunityFeedbackDialogComponent
} from '@opportunities/shared/components/feedback/opportunity-feedback-dialog/opportunity-feedback-dialog.component';
import { FeedbackCompletedComponent } from './components/feedback/feedback-completed/feedback-completed.component';
import { FeedbackReadyComponent } from './components/feedback/feedback-ready/feedback-ready.component';
import {
  BadgetsOpportunityInfoComponent
} from './components/badgets-opportunity-info/badgets-opportunity-info.component';
import {
  ApplicantDetailDialogComponent
} from '@opportunities/shared/components/applicant-detail-dialog/applicant-detail-dialog.component';
import {
  OpportunitiesFieldsSharedModule
} from '@shared/modules/opportunities-fields-shared/opportunities-fields-shared.module';
import {
  OpportunitiesManageActionsService
} from '@opportunities/modules/admin/service/opportunies-manage-actions.service';
import { ReopenDialogComponent } from './../modules/admin/components/reopen-dialog/reopen-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ExoCommonModule,
    ExoAlertModule,
    MatDialogModule,
    OverlayModule,
    BreakPointModule,
    CustomMd2DatepickerModule,
    OpportunitiesFieldsSharedModule
  ],
  declarations: [
    OpportunityMenuActionsComponent,
    CloseDialogComponent,
    ReopenDialogComponent,
    ViewSowComponent,
    OpportunityFeedbackDialogComponent,
    FeedbackCompletedComponent,
    FeedbackReadyComponent,
    BadgetsOpportunityInfoComponent,
    ApplicantDetailDialogComponent,
  ],
  exports: [
    OpportunitiesFieldsSharedModule,
    OverlayModule,
    OpportunityMenuActionsComponent,
    CloseDialogComponent,
    ViewSowComponent,
    SharedModule,
    FeedbackCompletedComponent,
    FeedbackReadyComponent,
    BadgetsOpportunityInfoComponent,
    ApplicantDetailDialogComponent,
  ],
  providers: [
    ManagementOpportunitiesActionsService,
    ManagementOpportunityFormService,
    OpportunitiesSerializerService,
    SowService,
    OpportunitiesFeedbackService,
    SowDeserializerService,
    OpportunitiesManageActionsService,
  ],
  entryComponents: [
    CloseDialogComponent,
    ReopenDialogComponent,
    ViewSowComponent,
    OpportunityFeedbackDialogComponent,
    ApplicantDetailDialogComponent,
  ],
})
export class OpportunitiesSharedModule { }
