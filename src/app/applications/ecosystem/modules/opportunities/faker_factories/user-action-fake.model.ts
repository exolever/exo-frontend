import * as MomentTZ from 'moment-timezone';
import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';
import {
  FakeUserApplicationFactory
} from '@applications/shared/faker_factories/user-application-fake.model';

import { UserActionModel } from '../models/user-action.model';


export class UserActionFakeFactory extends FakeModel ( UserActionModel ) {

  constructor() {
    super(MomentTZ(), faker.name.findName(), new FakeUserApplicationFactory());
  }

}
