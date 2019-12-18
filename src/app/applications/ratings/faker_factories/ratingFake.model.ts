import * as faker from 'faker';

import * as MomentTZ from 'moment-timezone';

import { FakeModel } from '@shared/faker_factories';
import { FakeUserApplicationFactory } from '@applications/shared/faker_factories';

import { RatingModel } from '../models/rating.model';

export class FakeRating extends FakeModel ( RatingModel ) {

  constructor() {
    super(faker.random.number().toString());
    this.user = new FakeUserApplicationFactory();
    this.created = MomentTZ();
    this.rating = faker.random.number();
    this.comment = faker.lorem.word();
    this.category = faker.lorem.word();
  }

}

