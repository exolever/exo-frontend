import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MapsAPILoader } from '@agm/core';
import * as faker from 'faker';

import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { OnboardingInvitationModel } from '@applications/registration/models/onboarding-invitation.model';
import { configTestBed } from '@testing/test.common.spec';
import { MapsAPILoaderStub } from '@testing/stubs/maps-api-loader-stub';

import { OnboardingStepperService } from '../../onboarding-stepper.service';
import { Step1Component } from './step-1.component';
import {
  OnBoardingServiceStub
} from '@applications/registration/components/onboarding-stepper/onboarding-stepper.component.spec';
import { TrackingServiceStubProvider } from '@core/services/tracking/tracking.service.stub';

describe('Step1Component', () => {
  let component: Step1Component;
  let fixture: ComponentFixture<Step1Component>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      NoopAnimationsModule,
      SharedModule,
      RouterTestingModule,
      TranslateStubModule
    ],
    declarations: [Step1Component],
    providers: [
      { provide: MapsAPILoader, useClass: MapsAPILoaderStub },
      { provide: OnboardingStepperService, useClass: OnBoardingServiceStub },
      TrackingServiceStubProvider
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(Step1Component);
    component = fixture.componentInstance;
    component.invitation = new OnboardingInvitationModel();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the step when there is no data (fullName, shortName, location) or any field is empty', () => {
    const spy = spyOn(component.goTo, 'emit');
    component.changePage({ step: 1, isLast: false });
    expect(spy).not.toHaveBeenCalled();

    component.formStep1.controls['fullName'].setValue('Full Name');
    component.changePage({ step: 1, isLast: false });
    expect(spy).not.toHaveBeenCalled();

    component.formStep1.controls['shortName'].setValue('Short Name');
    component.changePage({ step: 1, isLast: false });
    expect(spy).not.toHaveBeenCalled();

    component.formStep1.controls['location'].setValue('location');
    component.formStep1.controls['placeId'].setValue('place_id');
    component.changePage({ step: 1, isLast: false });
    expect(spy).toHaveBeenCalled();
  });

  it('#dataToSend should return the expected structure', () => {
    const fullName = faker.name.firstName;
    const shortName = faker.name.firstName;
    const location = faker.name.firstName;
    const placeId = faker.name.firstName;
    const personalMtp = faker.name.firstName;
    component.formStep1.controls['fullName'].setValue(fullName);
    component.formStep1.controls['shortName'].setValue(shortName);
    component.formStep1.controls['location'].setValue(location);
    component.formStep1.controls['placeId'].setValue(placeId);
    component.formStep1.controls['personalMtp'].setValue(personalMtp);
    const data = {
      location: location,
      full_name: fullName,
      short_name: shortName,
      place_id: placeId,
      personal_mtp: personalMtp
    };
    expect((component as any).dataToSend()).toEqual(data);
  });

});
