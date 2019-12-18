import * as faker from 'faker';
import * as MomentTZ from 'moment-timezone';

import { FakeModel } from '@shared/faker_factories';
import { UsersServiceRoles } from '@applications/service/shared/interfaces/roles.interface';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

import { ProjectModel } from '../models/project.model';
import { TeamModel } from '../models/team.model';
import { FakeTeamFactory } from './teamFake.model';

export class FakeProjectFactory extends FakeModel ( ProjectModel ) {
  consultantsRoles: Array<UsersServiceRoles> = [
    {
      userPk: faker.random.number( 300 ).toString(),
      roleName: faker.random.words(),
      roleCode: SprintRoleEnum.SPRINT_COACH_SPRINT.toString()
    }
  ];
  usersRoles: Array<UsersServiceRoles> = [
    { userPk: faker.random.number( 300 ).toString(), roleCode: SprintRoleEnum.OBSERVER_SPRINT.toString() }
  ];
  public pk = faker.random.number(100).toString();
  public name = faker.company.companyName();
  public firstDay = MomentTZ().utc();
  public lastDay = MomentTZ().utc().add(3, 'days');
  public myTeams: Array<TeamModel> = [];
  public teamSelected: TeamModel;
  public typeProject = 'W';
  public timezone = 'Europe/London';
  public permissions = [];

  constructor(teamNumbers: number = 1, stepsNumber: number = 1) {
    super();

    for (let i = 0; i < teamNumbers; i++) {
      const team = new FakeTeamFactory();
      this.myTeams.push(team);
    }
    this.teamSelected = this.myTeams[0];

  }

}
