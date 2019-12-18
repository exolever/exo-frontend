import * as faker from 'faker';

import { FakeModel } from '@shared/faker_factories';

import { StreamProjectEnum } from '../projects.enum';
import { Team } from './team.model';

export class FakeTeamFactory extends FakeModel(Team) {
  constructor() {
    super();
    this.pk = faker.random.number();
    this.name = faker.lorem.word();
    this.stream = {code: StreamProjectEnum.CORE, pk: '1', name: 'test'};
    // Manage advisory calls
    this.groupUuid = faker.lorem.word();
  }

}
