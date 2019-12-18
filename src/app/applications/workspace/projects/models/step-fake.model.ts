import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { FakeModel } from '@shared/faker_factories';

import { StepModel } from './step.model';

export class FakeStepFactory extends FakeModel(StepModel) {
  constructor() {
    super();
    this.pk = faker.random.number();
    this.name = faker.lorem.word();
    this.index = faker.random.number();
    this.start = MomentTZ(faker.date.past());
    this.end = MomentTZ(faker.date.future());
    this.current = true;
  }
}
