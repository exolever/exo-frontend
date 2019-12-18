import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { EcosystemMediaLibraryModule } from '@ecosystem-media-library/ecosystem-media-library.module';
import { InformationBlockModule } from '@service/shared/modules/information-block/information-block.module';
import { TasksModule } from '@service/shared/modules/tasks/tasks.module';
import { LoaderModule } from '@applications/loaders/loader.module';
import { CertificatesModule } from '@applications/certificates/certificates.module';
import { CommunicationModule } from '@applications/shared/communication/communication.module';
import { FeedbackModule } from '@service/shared/modules/feedback/feedback.module';

import { FilestackService } from '@core/services/filestack.service';

import {
  AssignmentComponent,
  AssignmentDeliverComponent,
  AssignmentLearnComponent,
  AssignmentReflectComponent,
  MediaComponent,
  TeamSelectionBarComponent,
  TaskPagePresentationComponent,
} from './components';
import { HeaderAssignmentService } from './services/header-assignment.service';
import { ManagementDeliverablesService } from './services/management-deliverables.service';
import { MemberCardModule } from './modules/member-card/member-card.module.';
import { AdvisoryCallModule } from './modules/advisory-call/advisory-call.module';
import { AdvisoryCallService } from './services/advisory-call.service';


@NgModule({

  imports: [
    SharedModule,
    RouterModule,
    EcosystemMediaLibraryModule,
    InformationBlockModule,
    TasksModule,
    CertificatesModule,
    LoaderModule,
    CommunicationModule,
    FeedbackModule,
    MemberCardModule,
    AdvisoryCallModule
  ],
  declarations: [
    AssignmentComponent,
    AssignmentDeliverComponent,
    AssignmentLearnComponent,
    AssignmentReflectComponent,
    MediaComponent,
    TeamSelectionBarComponent,
    TaskPagePresentationComponent,
  ],
  exports: [
    SharedModule,
    EcosystemMediaLibraryModule,
    InformationBlockModule,
    TasksModule,
    CertificatesModule,
    LoaderModule,
    CommunicationModule,
    FeedbackModule,
    AssignmentComponent,
    AssignmentDeliverComponent,
    AssignmentLearnComponent,
    AssignmentReflectComponent,
    MediaComponent,
    TeamSelectionBarComponent,
    TaskPagePresentationComponent,
    MemberCardModule,
    AdvisoryCallModule
  ],
  providers: [
    AdvisoryCallService,
    HeaderAssignmentService,
    ManagementDeliverablesService,
    FilestackService
  ]
})
export class SharedServiceModule { }
