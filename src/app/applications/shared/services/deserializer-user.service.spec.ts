import { inject, TestModuleMetadata } from '@angular/core/testing';

import * as faker from 'faker';

import { configTestBed } from '@testing/test.common.spec';

import { DeserializerUserService } from './deserializer-user.service';
import { socialNetworkType, SocialNetworkModel } from '../models/social-network.model';

describe('DeserializerUserService', () => {
  const moduleDef: TestModuleMetadata = {
    providers: [DeserializerUserService]
  };

  configTestBed(moduleDef, false);

  it('should ...', inject([DeserializerUserService], (service: DeserializerUserService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to parse a User', inject([DeserializerUserService], (service: DeserializerUserService) => {
    const data = {
      pk: faker.random.number(),
      fullName: faker.name.firstName(),
      shortName: faker.name.lastName(),
      bioMe: faker.lorem.paragraph(),
      aboutMe: faker.lorem.paragraph(),
      shortMe: faker.lorem.word(),
      location: faker.address.city() + ', ' + faker.address.country(),
      email: faker.internet.email(),
      profilePictures: [{ width: 10, height: 10, url: faker.internet.url() }]
    };
    const user = service.user(data);
    expect(user.getPicture(10)).toEqual(data.profilePictures[0].url);

  }));

  it('should be able to parse social networks', inject([DeserializerUserService],
    (service: DeserializerUserService) => {
      const social1 = {
        value: 'http://example.com',
        pk: faker.random.number(),
        networkType: socialNetworkType.twitter.toString()
      };
      const response = [social1];
      const socialNetworks = service.parseSocialNetworks(response);

      expect(socialNetworks[0].networkType).toEqual(social1.networkType);

      const newSocial = new SocialNetworkModel();
      newSocial.set(socialNetworks[0]);
      expect(newSocial.networkType).toEqual(social1.networkType);
    }));

});
