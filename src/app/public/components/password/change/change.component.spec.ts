import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@testing/stubs/router-stubs';
import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { UrlService } from '@core/services/api/resolve';
import { configTestBed } from '@testing/test.common.spec';

import { PasswordRecoverService } from '../services/password-recover.service';
import { ChangePasswordComponent } from './change.component';
import { PublicAreaConfigProvider } from '../../../public-area.config';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
  const sampleToken = 'xxxxxxxxxxxx';
  const sampleEmail = 'example@mail.com';
  // Encoded by python
  const sampleCipherEmail = '6578616d706c65406d61696c2e636f6d';
  // Original string was encoded by python method toHex()
  const originalString = 'This is an example string to encrypt using emails@domain.com';
  const pythonEncryptedString = '5468697320697320616e206578616d706c6520737472696e6720746f20656e6372797074207573696e672\
0656d61696c7340646f6d61696e2e636f6d';

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      HttpClientTestingModule,
      NoopAnimationsModule,
      TranslateStubModule
    ],
    providers: [
      UrlService,
      PasswordRecoverService,
      PublicAreaConfigProvider,
      { provide: ActivatedRoute, useValue: activatedRoute },
    ],
    declarations: [ChangePasswordComponent],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    activatedRoute.testParams = { token: sampleToken, mail: sampleCipherEmail };

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Url params (token and mail) readed correctly ...', () => {
    expect(component.getToken()).toEqual(sampleToken);
    expect(component.getCipherEmail()).toEqual(sampleEmail);
  });

  it('hex2a method should decode correctly ...', () => {
    expect(component.hex2a(pythonEncryptedString)).toEqual(originalString);
  });

  it('string2hex method should encode correctly ...', () => {
    expect(component.string2Hex(originalString)).toEqual(pythonEncryptedString);
  });

  it('password reseted should be falsy before submiting the form ...', () => {
    expect(component.isPasswordReset()).toBeFalsy();
  });

  it('when form is submitted service is called ... ', () => {
    const password = 'thisIsAValidPassword';
    spyOn(component.getRecoverService(), 'changePassword').and.callFake(
      function () {
        const fakedDescribe = function () { };
        fakedDescribe.prototype.subscribe = function () {
          return true;
        };
        return new fakedDescribe();
      }
    );
    component.getChangePasswordForm().controls.new_password1.setValue(password);
    component.getChangePasswordForm().controls.new_password2.setValue(password);
    component.onSubmit();
    expect(component.getRecoverService().changePassword).toHaveBeenCalled();
    expect(component.getRecoverService().changePassword).toHaveBeenCalledTimes(1);
  });

});
