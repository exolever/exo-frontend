import {TestBed, TestModuleMetadata} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloService, InvitationBuilderService, UrlService} from '../../core/services';
import {configTestBed} from '../../testing/test.common.spec';

import {SignupService} from './signup.service';

describe('SignupService', () => {
  let service: SignupService;

  const moduleDef: TestModuleMetadata = {
    imports: [HttpClientTestingModule],
    providers: [
      SignupService,
      {provide: ApolloService, useValue: {}},
      {provide: UrlService, useValue: {}},
      {provide: InvitationBuilderService, useValue: {}}
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    service = TestBed.get(SignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
