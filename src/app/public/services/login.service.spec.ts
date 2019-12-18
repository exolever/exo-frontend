import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { environment } from '@environments/environment';
import { UrlService } from '@app/core';
import { socialNetworkType } from '@applications/shared/models';
import { configTestBed } from '@testing/test.common.spec';
import { LoginService } from './login.service';

describe('Service: LoginService', () => {
  let service: LoginService;

  const moduleDef: TestModuleMetadata = {
    imports: [ HttpClientTestingModule ],
    providers: [
      UrlService,
      LoginService
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    service = TestBed.get( LoginService );
  });

  it ('should create', () => {
    expect ( service ).toBeTruthy();
  });

  it ('should return an observable whenever login method is called', () => {
    const allegedlyObservable = service.login( 'whatever', 'whenever' );

    expect ( typeof (allegedlyObservable)).toBe( 'object' );
    expect ( allegedlyObservable.constructor.name ).toBe( 'Observable' );
  });

  it ('should return url to login through Medium authentication', () => {
    const urlMediumLogin = service.loginSocialNetwork( socialNetworkType.medium );

    expect ( urlMediumLogin ).toBe( environment['baseUrl'] + 'login/medium/' );
  });

  it ('should return an observable whenever disconnectSocialNetwork method is called', () => {
    const allegedlyObservable = service.disconnectSocialNetwork( socialNetworkType.linkedin );

    expect ( typeof (allegedlyObservable)).toBe( 'object' );
    expect ( allegedlyObservable.constructor.name ).toBe( 'Observable' );
  });
});
