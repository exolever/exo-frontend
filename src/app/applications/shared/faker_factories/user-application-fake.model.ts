import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { FakeModel } from '@shared/faker_factories';

import { UserApplicationModel } from '../../shared/models/user-application.model';

export class FakeUserApplicationFactory extends FakeModel ( UserApplicationModel ) {

  aboutMe = faker.lorem.paragraph();
  agreements = [];
  bioMe = faker.lorem.paragraph();
  created = MomentTZ().utc();
  email = faker.internet.email();
  //  = faker.internet.email();
  fullName = faker.name.firstName();
  passwordUpdated: false;
  phone = faker.phone.phoneNumber();
  profilePictures = [];
  shortMe = faker.lorem.words(10);
  shortName = faker.name.lastName();
  socialNetworks = [];
  location = 'Granada, Spain';
  timezone = 'CET';
  uuid = faker.random.uuid();
  userTitle = faker.lorem.word();
  isOpenExOMember =  faker.random.boolean();
  constructor() {
    super(faker.random.number().toString());
  }

}
