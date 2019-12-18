import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { environment } from '@environments/environment';
import { configTestBed } from '@testing/test.common.spec';

import { UrlService } from '../api/resolve/';
import { ApiResources } from '../api/resolve/';

describe('UrlService build...', () => {
  let service: UrlService;

  const moduleDef: TestModuleMetadata = {
    providers: [
      UrlService,
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    service = TestBed.get( UrlService );
  });

  it('should ...', () => {
    expect( service ).toBeTruthy();
  });

  it('Url resolved without params', () => {
    const url_resolved = service.resolveAPI(ApiResources.LANGUAGES);
    expect(url_resolved).toBe(environment['baseUrl'] + 'api/core/languages/', ' Url without params resolved');
  });

  it('Url resolved without params but send it', () => {
    const url_resolved = service.resolveAPI(ApiResources.LANGUAGES, 'param1', 'param2');
    expect(url_resolved).toBe(environment['baseUrl'] + 'api/core/languages/', ' Url without params resolved');
  });
  it('Url resolved without some params', () => {
    const url_resolved = service.resolveAPI(ApiResources.CIRCLE_FOLLOWERS, 'param1');
    expect(url_resolved).toBe(environment['baseUrl'] +
      'api/circles/param1/followers/', ' Url with 1 param resolved');
  });
});
