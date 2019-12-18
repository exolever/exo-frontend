import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import { OnboardingInvitationModel } from '@applications/registration/models/onboarding-invitation.model';


@Injectable()
export class OnboardingStepperService {
  private step: number;
  private lastStepActivated = 1;
  private stepToShow = new BehaviorSubject(1);
  stepToShow$ = this.stepToShow.asObservable();

  constructor() {}

  getCurrentStep(): number {
    return this.step;
  }

  getLastStepActivated(): number {
    return this.lastStepActivated;
  }

  activeStep(nextStep: number) {
    this.step = nextStep;
    if (nextStep > this.lastStepActivated) {
      this.lastStepActivated = nextStep;
    }
    this.stepToShow.next(nextStep);
  }

  fillFormFromInvitation(invitation: OnboardingInvitationModel, form: FormGroup): void {
    Object.keys(invitation).forEach(key => {
      if (form.get(key)) {
        form.get(key).setValue(invitation[key]);
      }
    });
  }

}
