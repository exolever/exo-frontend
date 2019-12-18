import * as faker from 'faker';

import { ProjectMember } from './project-member.model';
import { FakeUserModelFactory } from '@core/faker_factories';
import { FakeModel } from '@shared/faker_factories';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

import { ProjectMemberActionsEnum } from '../projects.enum';

export class FakeProjectMemberFactory extends FakeModel(ProjectMember) {
  constructor() {
    super();
    this.pk = faker.random.number();
    this.user = new FakeUserModelFactory();
    this.projectRoles = [
      {
        code: SprintRoleEnum.HEAD_COACH_SPRINT,
        name: faker.random.word(),
      }
    ];
    this.teamRoles = [];
    this.actions = [
      ProjectMemberActionsEnum.DELETE_MEMBER,
      ProjectMemberActionsEnum.EDIT_COLLABORATOR
    ];
  }

}


