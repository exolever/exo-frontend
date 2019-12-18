import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExoCommonModule } from '@shared/exo-common.module';
import { PipeModule } from '@shared/pipes/pipes.module';
import { SharedComponentsModule } from '../../components/components.module';
import { PaymentManagementComponent } from './components/payment-management/payment-management.component';
import { OpportunitiesFieldSharedService } from './services/opportunities-fields-shared.service';
import { QuestionsManagementComponent } from './components/questions-management/questions-management.component';
import { TargetManagementComponent } from './components/target-management/target-management.component';
import { EcosystemSearcherModule } from '../ecosystem-searcher/ecosystem-searcher.module';
import { ModeManagementComponent } from './components/mode-management/mode-management.component';
import { DirectivesModule } from '../../directives/directives.module';
import { LanguagesManagementComponent } from './components/languages-management/languages-management.component';

@NgModule({
  imports: [
    ExoCommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    SharedComponentsModule,
    DirectivesModule,
    EcosystemSearcherModule
  ],
  declarations: [
    PaymentManagementComponent,
    QuestionsManagementComponent,
    TargetManagementComponent,
    ModeManagementComponent,
    LanguagesManagementComponent
  ],
  providers: [
    OpportunitiesFieldSharedService
  ],
  exports: [
    PaymentManagementComponent,
    QuestionsManagementComponent,
    TargetManagementComponent,
    ModeManagementComponent,
    LanguagesManagementComponent
  ],
})
export class OpportunitiesFieldsSharedModule { }
