import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { FakeModel } from '@shared/faker_factories';

import { Survey } from './exq.model';

export class FakeSurveyFactory extends FakeModel(Survey) {

  constructor() {
    super({
      pk: faker.random.number(),
      name: faker.random.word(),
      created: MomentTZ(),
      publicUrl: faker.internet.url(),
      sendResults: true,
      showResults: true,
      slug: faker.random.word(),
      totalAnswers: 1,
      results : [{
        name: faker.random.word(),
        organization: faker.random.word(),
        email: faker.internet.email(),
        total: faker.random.number(),
        industry: faker.random.number(),
        results: [{
          section: 'M',
          score: faker.random.number()
        }]
      }]
    });
  }
}
