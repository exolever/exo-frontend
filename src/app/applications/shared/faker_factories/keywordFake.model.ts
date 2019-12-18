import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';

import { KeywordModel } from '../models/keyword.model';


export class FakeKeywordFactory extends FakeModel ( KeywordModel ) {

  constructor() {
    super(faker.lorem.words(5));
    this.pk = faker.random.number().toString();
    this.level = faker.random.number();
  }

}
