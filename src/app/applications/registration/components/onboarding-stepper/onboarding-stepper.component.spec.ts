import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of as observableOf } from 'rxjs';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { ActivatedRouteStub, RouterStub } from '@testing/stubs/router-stubs';
import { SharedModule } from '@shared/shared.module';
import { UserService } from '@core/services';
import { UserServiceStub } from '@core/services/stubs';
import { MessageService } from '@applications/messages/messages.service';
import { FakeUserModelFactory } from '@core/faker_factories';
import { configTestBed } from '@testing/test.common.spec';

import { InvitationService } from '../../services/invitation.service';
import { FakeOnboardingInvitationFactory } from '../../faker_factories/onboarding-invitation-fake.model';
import { OnboardingStepperComponent } from '../onboarding-stepper/onboarding-stepper.component';
import { OnboardingStepperService } from './onboarding-stepper.service';
import { CookieService } from 'ngx-cookie-service';
import { EarlyParrotService } from '@core/services/early-parrot.service';

class StubInvitationService {
  sendAction() {
    return observableOf(true);
  }
  getInvitation() {
    return observableOf(new FakeOnboardingInvitationFactory());
  }
}

export class OnBoardingServiceStub {
  stepToShow$ = observableOf({});
  activeStep(stepNumber) { }
  fillFormFromInvitation(invitation, form) {}
  getLastStepActivated() {}
  getCurrentStep() {}
}

describe('OnBoardingStepperComponent', () => {
  let component: OnboardingStepperComponent;
  let fixture: ComponentFixture<OnboardingStepperComponent>;
  let activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
  let invitationService: InvitationService;
  let onBoardingService: OnboardingStepperService;

  beforeEach(() => {
    activatedRoute.testDataParams = { loggedUser: new FakeUserModelFactory() };
    activatedRoute.testParams = { hash: 1 };
  });

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      NoopAnimationsModule,
      TranslateStubModule
    ],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: Router, useClass: RouterStub },
      { provide: InvitationService, useClass: StubInvitationService },
      { provide: UserService, useClass: UserServiceStub },
      { provide: MessageService, useValue: {} },
      { provide: OnboardingStepperService, useClass: OnBoardingServiceStub },
      CookieService,
      { provide: EarlyParrotService, useValue: { createSubscribe() { return observableOf(); }}}
    ],
    declarations: [
      OnboardingStepperComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    invitationService = TestBed.get(InvitationService);
    onBoardingService = TestBed.get(OnboardingStepperService);

    fixture = TestBed.createComponent(OnboardingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created and request data', () => {
    const spyInvitation = spyOn(invitationService, 'getInvitation').and.callFake(() => observableOf(true));
    const spyOnBoarding = spyOn(onBoardingService, 'activeStep').and.callFake(() => observableOf(true));
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testParams = { hash: 1 };
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(spyInvitation).toHaveBeenCalled();
    expect(spyOnBoarding).toHaveBeenCalled();
  });

  it('goTo works for an intermedite step ', () => {
    const spyOnBoarding = spyOn(onBoardingService, 'activeStep').and.callFake(() => observableOf(true));

    component.goTo({
      data: {},
      isLast: false,
      step: 2
    });

    expect(spyOnBoarding).toHaveBeenCalled();
    expect(spyOnBoarding).toHaveBeenCalledWith(2);
  });

  it('goTo works for the final step', () => {
    const spyOnBoarding = spyOn(onBoardingService, 'activeStep').and.callFake(() => observableOf(true));
    const spyComponent = spyOn(component, 'finish');

    component.goTo({
      data: {},
      isLast: true,
      step: 2
    });

    expect(spyOnBoarding).not.toHaveBeenCalled();
    expect(spyComponent).toHaveBeenCalled();
  });

  it('goTo updates well the information to send to the backend', () => {
    const dataForTesting = { test: 'testing' };
    component.dataToSend = {};
    component.goTo({
      data: dataForTesting
    });

    expect(JSON.stringify(component.dataToSend)).toBe(JSON.stringify(dataForTesting));
  });

  it('goTo doesn\'t update the information to send because it doesn\'t exit', () => {
    component.dataToSend = {};
    component.goTo({
      isLast: true
    });

    expect(JSON.stringify(component.dataToSend)).toBe(JSON.stringify({}));
  });

  it('finish calls the backend with the right information', () => {
    const spyInvitation = spyOn(invitationService, 'sendAction').and.callFake(() => observableOf(true));
    const dataTesting = {
      var1: 'value1',
      var2: 'value2'
    };
    component.dataToSend = dataTesting;
    component.finish();
    expect(spyInvitation).toHaveBeenCalled();
    const jsonParam = spyInvitation.calls.first().args[2];
    expect(JSON.stringify(jsonParam)).toBe(JSON.stringify(dataTesting));
  });
});
