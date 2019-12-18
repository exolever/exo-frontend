import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { typeProjectEnum } from '@applications/service/shared/enums/project.enum';

import {
  ProjectsRoles, ProjectsWithinRoles, RoleDescription
} from '../interfaces/projects-roles.interface';


export class FakeProjectsRolesFactory implements ProjectsRoles {
  badge: { status: string };
  project: ProjectsWithinRoles;
  rating: number;
  roles: RoleDescription[];
  status: string;
  constructor() {
    this.badge = {status: faker.lorem.word()};
    this.project = {
      pk: faker.random.number().toString(),
      name: faker.lorem.word(),
      start: MomentTZ().utc(),
      firstDay: MomentTZ().utc(),
      typeProject: typeProjectEnum.Sprint,
      customer: { name: faker.lorem.word() },

    };
    this.rating = faker.random.number();
    this.roles = [
      {code: faker.lorem.word(), name: faker.lorem.word()},
      {code: faker.lorem.word(), name: faker.lorem.word()},
      {code: faker.lorem.word(), name: faker.lorem.word()}
    ];
  }
}
