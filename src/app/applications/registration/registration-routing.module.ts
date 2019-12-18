import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedUserResolver } from '@app/routing/resolvers/logged-user.resolver';

import { AgreementComponent } from './components/agreement/agreement.component';
import { OnboardingStepperComponent } from './components/onboarding-stepper/onboarding-stepper.component';


const registrationRoutes: Routes = [
  {
    path: 'profile/:hash',
    component: OnboardingStepperComponent,
    resolve: { loggedUser: LoggedUserResolver }
  },
  {
    path: 'agreement/:hash',
    component: AgreementComponent
  },
  {
    path: 'pending/:hash',
    component: AgreementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(registrationRoutes)],
  exports: [RouterModule],
  providers: []
})
export class RegistrationRoutingModule { }
