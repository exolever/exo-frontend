import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { UserService } from '@app/core';
import { RatingModule } from '@ratings/rating.module';
import { LoaderModule } from '@loaders/loader.module';
import { BreadcrumbModule } from '@applications/breadcrumb/breadcrumb.module';
import { OpportunitiesListService } from '@ecosystem/modules/opportunities/services/opportunities-list.service';
import { OpportunityDetailService } from '@ecosystem/modules/opportunities/services/opportunity-detail.service';
import { ValidationConfigProvider } from '@core/config/validation-config';
import { CommunicationEffect } from '@applications/shared/communication/store/effect/communication.effect';
import { CommunicationModule } from '@applications/shared/communication/communication.module';
import { OpportunitiesAdminEffect } from '@opportunities/modules/admin/store/effects/opportunities-admin.effect';
import { FilestackService } from '@core/services/filestack.service';
import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';
import { OpportunitiesComponent } from '@ecosystem/modules/opportunities/container/opportunities.component';
import {
  OpportunityCardByYouComponent
} from '@opportunities/components/opportunity-card-by-you/opportunity-card-by-you.component';
import {
  OpportunitiesByYouComponent
} from '@ecosystem/modules/opportunities/components/opportunities-by-you/opportunities-by-you.component';
import {
  OpportunitiesAdminService
} from '@ecosystem/modules/opportunities/modules/admin/service/opportunities-admin.service';
import {
  RequiredCertificationDialogComponent
} from '@shared/components/dialogs/required-certification-dialog/required-certification-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { BreakPointModule } from '@applications/break-point/break-point.module';

import { OpportunitiesCardComponent } from './components/opportunity-card/opportunities-card.component';
import { OpportunitiesAllComponent } from './components/opportunities-all/opportunities-all.component';
import { OpportunityDetailComponent } from './components/opportunity-detail/opportunity-detail.component';
import { OpportunityDataComponent } from './components/opportunity-detail/opportunity-data/opportunity-data.component';
import { OpportunityDataService } from './components/opportunity-detail/opportunity-data/opportunity-data.service';
import { OpportunityFormComponent } from './components/opportunity-form/opportunity-form.component';
import { OpportunitiesRoutingModule } from './opportunities-routing.module';
import { reducers } from './store/reducers';
import { OpportunitiesEffect } from './store/effects/opportunities.effect';
import { OpportunitiesSharedModule } from './shared/opportunities-shared.module';
import { OpportunityFormLayoutComponent } from './components/opportunity-form-layout/opportunity-form-layout.component';
import { OpportunitiesGuard } from './modal-save-changes.guard';
import { OpportunityChatComponent } from './components/opportunity-chat/opportunity-chat.component';
import { ApplicantFeedbackComponent } from './components/applicant-feedback/applicant-feedback.component';
import {
  OpportunityDialogApplyComponent
} from './components/opportunity-dialog-apply/opportunity-dialog-apply.component';
import {
  OpportunityPreviewComponent
} from './components/opportunity-preview/opportunity-preview.component';


@NgModule({
  imports: [
    OpportunitiesRoutingModule,
    SharedModule,
    LoaderModule,
    RatingModule,
    CustomMd2DatepickerModule,
    BreadcrumbModule,
    OpportunitiesSharedModule,
    CommunicationModule,
    BreakPointModule,
    StoreModule.forFeature('opportunities', reducers),
    EffectsModule.forFeature([ OpportunitiesEffect, CommunicationEffect, OpportunitiesAdminEffect ]),
  ],
  providers: [
    OpportunitiesListService,
    OpportunityDetailService,
    OpportunitiesAdminService,
    UserService,
    ValidationConfigProvider,
    OpportunitiesGuard,
    FilestackService,
    OpportunityDataService
  ],
  declarations: [
    OpportunitiesComponent,
    OpportunitiesByYouComponent,
    OpportunitiesAllComponent,
    OpportunitiesCardComponent,
    OpportunityDetailComponent,
    OpportunityDialogApplyComponent,
    OpportunityFormComponent,
    OpportunityDataComponent,
    OpportunityFormLayoutComponent,
    OpportunityPreviewComponent,
    OpportunityCardByYouComponent,
    OpportunityChatComponent,
    ApplicantFeedbackComponent
  ],
  exports : [
    OpportunityDataComponent,
    OpportunityCardByYouComponent
  ],
  entryComponents: [
    OpportunitiesAllComponent,
    OpportunityDialogApplyComponent,
    OpportunityFormComponent,
    OpportunityPreviewComponent,
    RequiredCertificationDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OpportunitiesModule { }
