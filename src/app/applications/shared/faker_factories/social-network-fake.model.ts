import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';
import { socialNetworkType } from '@applications/shared/models/social-network.model';

import { SocialNetworkModel } from '../models/social-network.model';

export class FakeSocialNetworkFactory extends FakeModel ( SocialNetworkModel ) {

  pk = faker.random.number().toString();
  networkType = socialNetworkType.twitter.toString();
  value = faker.lorem.word();

}
