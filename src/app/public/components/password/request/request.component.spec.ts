import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, ComponentFixture, TestModuleMetadata } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

import * as faker from 'faker';

import { ActivatedRouteStub } from '@testing/stubs/router-stubs';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { UrlService } from '@core/services/api/resolve';
import { SharedModule } from '@shared/shared.module';
import { configTestBed } from '@testing/test.common.spec';

import { PasswordRecoverService } from '../services/password-recover.service';
import { RequestPasswordComponent } from './request.component';
import { PublicAreaConfigProvider } from '../../../public-area.config';

describe('RequestPasswordComponent', () => {
  let component: RequestPasswordComponent;
  let fixture: ComponentFixture<RequestPasswordComponent>;

  const moduleDef: TestModuleMetadata = {
    declarations: [RequestPasswordComponent],
    imports: [
      HttpClientTestingModule,
      SharedModule,
      NoopAnimationsModule,
      TranslateStubModule
    ],
    providers: [
      UrlService,
      PasswordRecoverService,
      PublicAreaConfigProvider,
      { provide: ActivatedRoute, useClass: ActivatedRouteStub }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('password request form requested status should be falsy before submiting the form ...', () => {
    expect(component.isFormOk()).toBeFalsy();
  });

  it('when form to change password is submited service is called ...', () => {
    spyOn(component.getRecoverService(), 'requestPassword').and.callFake(
      function () {
        const fakedDescribe = function () { };
        fakedDescribe.prototype.subscribe = function () {
          return true;
        };
        return new fakedDescribe();
      }
    );
    const mail = faker.internet.email();
    component.getRequestForm().controls.email.setValue(mail);
    component.onSubmit();
    expect(component.getRecoverService().requestPassword).toHaveBeenCalled();
    expect(component.getRecoverService().requestPassword).toHaveBeenCalledTimes(1);
  });

});
