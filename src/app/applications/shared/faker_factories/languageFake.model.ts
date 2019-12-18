import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';

import { LanguageModel } from '../../shared/models/language.model';

export class FakeLanguageFactory extends FakeModel ( LanguageModel ) {

  constructor() {
    super(faker.lorem.words(), faker.random.number().toString());
  }

}
