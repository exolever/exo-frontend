import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { GenericProject } from './project.model';
import { FakeUserModelFactory } from '@core/faker_factories';
import { FakeModel } from '@shared/faker_factories';

import { StatusProjectEnum } from '../projects.enum';

export class FakeGenericProjectFactory extends FakeModel(GenericProject) {
  constructor() {
    super();
    this.pk = faker.random.number();
    this.name = faker.lorem.word();
    this.location = faker.lorem.word();
    this.placeId = faker.lorem.word();
    this.start = MomentTZ();
    this.templateName = faker.lorem.word();
    this.users = [new FakeUserModelFactory(), new FakeUserModelFactory()];
    this.status = StatusProjectEnum.DRAFT;
    this.currentStep = {name: faker.lorem.word(), pk: faker.random.number()};
    this.client = faker.lorem.word();
    this.settings = {
      ticketsModuleEnabled: faker.random.boolean(),
      swarmSessionsModuleEnabled: faker.random.boolean(),
      teamCommunicationsModuleEnabled: faker.random.boolean(),
      askEcosystemEnabled: faker.random.boolean(),
      directoryEnabled: faker.random.boolean()
    };
  }

}
