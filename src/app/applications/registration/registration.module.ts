import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';
import { EcosystemNavbarModule } from '@applications/ecosystem-navbar/ecosystem-navbar.module';
import { ApplicationsSharedModule } from '@applications/shared/applications-shared.module';

import { RegistrationRoutingModule } from './registration-routing.module';
import { AgreementComponent } from './components/agreement/agreement.component';
import { AgreementDialogComponent } from './components/agreement/agreement-dialog/agreement-dialog.component';
import { InvitationService } from './services/invitation.service';
import { OnboardingStepperComponent } from './components/onboarding-stepper/onboarding-stepper.component';
import { OnboardingStepComponent } from './components/onboarding-stepper/onboarding-step/onboarding-step.component';
import { Step1Component } from './components/onboarding-stepper/steps/step-1/step-1.component';
import { OnboardingStepperService } from './components/onboarding-stepper/onboarding-stepper.service';
import { Step2Component } from './components/onboarding-stepper/steps/step-2/step-2.component';
import { Step0Component } from './components/onboarding-stepper/steps/step-0/step-0.component';
import { UpdateTOSDialogComponent } from './components/agreement/update-tos-dialog/update-tos-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    EcosystemNavbarModule,
    RegistrationRoutingModule,
    ApplicationsSharedModule,
    MatSlideToggleModule
  ],
  declarations: [
    AgreementComponent,
    AgreementDialogComponent,
    OnboardingStepperComponent,
    OnboardingStepComponent,
    Step1Component,
    Step2Component,
    Step0Component,
    UpdateTOSDialogComponent,
  ],
  providers: [InvitationService, OnboardingStepperService],
  entryComponents: [AgreementDialogComponent,  UpdateTOSDialogComponent]
})
export class RegistrationModule { }
