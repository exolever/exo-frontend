import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '@testing/test.common.spec';
import { socialNetworkType, UserApplicationModel } from '@applications/shared/models';
import {
  IUserApplicationBackendResponse
} from '@applications/shared/interfaces/user-consultant-backend-response.interface';

import { UserAndConsultantResponseDigestService } from './user-and-consultant-response-digest.service';
import { CertificatesModule } from '@applications/certificates/certificates.module';

describe('UserAndConsultantResponseDigestService', () => {
  let service: UserAndConsultantResponseDigestService;

  const moduleDef: TestModuleMetadata = {
    imports: [
      CertificatesModule
    ],
    providers: [
      UserAndConsultantResponseDigestService
    ]
  };
  configTestBed(moduleDef, false);

  beforeAll(() => {
    service = TestBed.get(UserAndConsultantResponseDigestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly parse social networks', () => {
    const type1 = 'L';
    const value1 = 'https://www.linkedin.com/the-great-master-13';
    const type2 = 'T';
    const value2 = 'https://twitter.com/donald-tump-duke-nukem';
    const socialNetworksFakeResponse = [
      {networkType: type1, value: value1},
      {networkType: type2, value: value2}
    ];
    const fakeObjResponse = { socialNetworks: socialNetworksFakeResponse };
    const parsedUserSocialNetworks: UserApplicationModel =
      service.digestResponseAndBuildUserApplicationData(<IUserApplicationBackendResponse>fakeObjResponse);

    expect(parsedUserSocialNetworks.socialNetworks.length).toEqual(2);
    expect(parsedUserSocialNetworks.socialNetworks[0].getName().toLowerCase()).toEqual(socialNetworkType[type1]);
    expect(parsedUserSocialNetworks.socialNetworks[1].getName().toLowerCase()).toEqual(socialNetworkType[type2]);
    expect(parsedUserSocialNetworks.socialNetworks[0].value).toEqual(value1);
    expect(parsedUserSocialNetworks.socialNetworks[1].value).toEqual(value2);
  });

});
