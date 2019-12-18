import { ComponentFixture, TestBed, inject, TestModuleMetadata } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as faker from 'faker';

import { of as observableOf } from 'rxjs';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs/api-service-stub';
import { ExoCommonModule } from '@shared/exo-common.module';
import { ActivatedRouteStub } from '@testing/stubs/router-stubs';
import { PipeModule } from '@shared/pipes/pipes.module';
import { UserServiceStub, LocalStorageServiceStub } from '@core/services/stubs';
import { UserService, LocalStorageService } from '@core/services';
import { PublicMessageStatusEnum } from '@public/shared/public-messages.functions';
import { configTestBed } from '@testing/test.common.spec';
import { TrackingServiceStubProvider } from '@core/services/tracking/tracking.service.stub';

import { SignupComponent } from '../signup/signup.component';
import { FakeSignupModelFactory } from '../../faker_factories/signup.fake';
import { SignupService } from '../../services/signup.service';
import { PublicAreaConfigProvider } from '../../public-area.config';


class SignupServiceStub {
  getSignupInvitation() {
    return observableOf(new FakeSignupModelFactory());
  }
  signup() {
    return observableOf(new FakeSignupModelFactory());
  }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      ExoCommonModule,
      ReactiveFormsModule,
      PipeModule,
      RouterTestingModule,
      NoopAnimationsModule,
      TranslateStubModule
    ],
    declarations: [
      SignupComponent
    ],
    providers: [
      TrackingServiceStubProvider,
      PublicAreaConfigProvider,
      URL_SERVICE_STUB_PROVIDER,
      { provide: UserService, useClass: UserServiceStub },
      { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      { provide: SignupService, useClass: SignupServiceStub }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not send form', inject([SignupService], (signupService: SignupServiceStub) => {
    const spy = spyOn(signupService, 'getSignupInvitation');
    expect(component.signupForm.valid).toBeFalsy();
    expect(spy.calls.count()).toBe(0, 'form is not sended');
  }));

  it('cases invalid form', () => {
    expect(component.signupForm.valid).toBeFalsy('Empty form');
    component.signupForm.controls['email'].setValue(faker.internet.email());
    expect(component.signupForm.valid).toBeFalsy('Password empty');
    component.signupForm.controls['email'].setValue('');
    component.signupForm.controls['password'].setValue(faker.random.number());
    expect(component.signupForm.valid).toBeFalsy('Email empty');
    component.signupForm.controls['email'].setValue(faker.internet.email());
    expect(component.signupForm.valid).toBeTruthy('OK');
  });

  it('should send form', inject([SignupService], (signupService: SignupServiceStub) => {
    component.signupForm.controls['email'].setValue(faker.internet.email());
    component.signupForm.controls['password'].setValue(faker.random.number());
    const spy = spyOn(signupService, 'getSignupInvitation').and
      .returnValue(observableOf(new FakeSignupModelFactory()));
    component.ngOnInit();
    component.onSubmit();
    expect(component.signupForm.valid).toBeTruthy();
    expect(spy.calls.count()).toBe(1, 'form is sended');
  }));

  it('should show an error message for not SocialAuth linked', inject(
    [ActivatedRoute], (service: ActivatedRouteStub) => {
    service.queryParams = observableOf({
      code: PublicMessageStatusEnum.SocialAuthNotLinked
    });
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.userMessage).not.toBeUndefined();
  }));

});
