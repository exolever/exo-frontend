import { FormBuilder } from '@angular/forms';

import * as faker from 'faker';

import { OnboardingInvitationModel } from '@applications/registration/models/onboarding-invitation.model';

import { OnboardingStepperService } from './onboarding-stepper.service';

describe('OnboardingStepperService', () => {
  let service: OnboardingStepperService;

  beforeEach(() => {
    service = new OnboardingStepperService();
  });

  it('#activeStep should update the step to show', () => {
    service.activeStep(3);
    expect(service.getCurrentStep()).toEqual(3);
  });

  it('#fillFormFromInvitation should fill form from invitation', () => {
    const fullName = faker.name.firstName();
    const shortName = faker.name.firstName();
    const invitation = new OnboardingInvitationModel();
    invitation.fullName = fullName;
    invitation.shortName = shortName;
    const form = new FormBuilder();
    const formGroup = form.group({
      fullName: [],
      shortName: [],
      location: []
    });
    service.fillFormFromInvitation(invitation, formGroup);
    expect(formGroup.get('fullName').value).toEqual(fullName);
    expect(formGroup.get('shortName').value).toEqual(shortName);
    expect(formGroup.get('location').value).toBeNull();
  });

});
