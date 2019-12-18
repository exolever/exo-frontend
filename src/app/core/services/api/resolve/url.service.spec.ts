import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '@testing/test.common.spec';
import { Urls, UrlService } from '@app/core';

describe('We can navigate', () => {
  let service: UrlService;

  const moduleDef: TestModuleMetadata = {
    providers: [UrlService]
  };
  configTestBed(moduleDef, false);

  beforeEach(() => {
    service = TestBed.get(UrlService);
  });

  it('should be created properly', () => {
    expect(service).toBeTruthy();
  });

  it('building an url without parameters', () => {
    const url_resolved = service.getPath([Urls.LOGIN]);
    expect(url_resolved).toEqual('auth/login/');
  });

});
