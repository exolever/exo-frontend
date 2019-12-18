import {TestBed, TestModuleMetadata} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {UrlServiceStub} from '@core/services/stubs/api-service-stub';
import {getValueEnum} from '@shared/helpers/enum.helper';
import {InvitationActionEnum} from '@shared/enums/invitation.enum';
import {ApolloAuthService, InvitationBuilderService, UrlService} from '@core/services';
import {configTestBed} from '@testing/test.common.spec';
import {InvitationService} from '../invitation.service';

describe('AgreementService', () => {
  let service: InvitationService;

  const moduleDef: TestModuleMetadata = {
    imports: [HttpClientTestingModule],
    providers: [
      InvitationService,
      {provide: ApolloAuthService, useValue: {}},
      {provide: UrlService, useClass: UrlServiceStub},
      {provide: InvitationBuilderService, useValue: {}}
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    service = TestBed.get(InvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('All actions are covered', () => {
    Object.keys(InvitationActionEnum).forEach(action => {
      expect(service.sendAction(getValueEnum(InvitationActionEnum, action), 'XXX')).not.toBeUndefined();
    });
  });
});

