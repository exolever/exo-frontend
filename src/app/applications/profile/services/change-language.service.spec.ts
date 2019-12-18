import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { UrlService } from '@core/services/api/resolve/urls';
import { UrlServiceStub } from '@core/services/stubs/api-service-stub';
import { AuthServiceStub } from '@testing/stubs/auth-service-stub';
import { configTestBed } from '@testing/test.common.spec';

import { ChangeLanguageService } from './change-language.service';

describe('ChangeLanguageService ', () => {
  let service: ChangeLanguageService;
  let authHttp: HttpClient;
  let urlService: UrlService;

  const moduleDef: TestModuleMetadata = {
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      ChangeLanguageService,
      {
        provide: HttpClient,
        useClass: AuthServiceStub
      },
      {
        provide: UrlService,
        useClass: UrlServiceStub
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    authHttp = TestBed.get(HttpClient);
    urlService = TestBed.get(UrlService);
    service = new ChangeLanguageService(authHttp, urlService);
  });

  it('#changeLanguage should do a PUT with a map as parameter', () => {
    const spyBack = spyOn(authHttp, 'put').and.callThrough();
    const language = 'es';

    service.changeLanguage('1', language).subscribe();

    expect(spyBack).toHaveBeenCalledTimes(1);
    expect(spyBack.calls.first().args[1]).toEqual({
      'platform_language': language
    });
  });

});
