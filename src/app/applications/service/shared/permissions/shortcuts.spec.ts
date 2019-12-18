import { FakeUserModelFactory } from '@core/faker_factories';
import { StaticPermissions } from '@core/services/acl/permissions';
import { FakeProjectFactory } from '../../old-project/faker_factories';
import { hasTeamPerm } from './shortcuts';

describe('A user in a project', () => {
  let project;
  let team;

  beforeEach(() => {
    project = new FakeProjectFactory(1, 0);
    team = project.myTeams[0];
  });

  it('can have all perms if he/she is supervisor or manager in all the teams =>', () => {
    const user = new FakeUserModelFactory();
    user.modelPropertiesCustom([{
      name: 'isSuperuser', data: true
    }]);
    expect(hasTeamPerm(project, team, StaticPermissions.TEAM_TEAM_CAN_CHANGE_TEAM, user)).toBe(true);
    const user2 = new FakeUserModelFactory(); // No superuser
    project.permissions = [
      StaticPermissions.PROJECT_PROJECT_VIEW_PROJECT,
      StaticPermissions.PROJECT_PROJECT_PROJECT_MANAGER];
    expect(hasTeamPerm(project, team, StaticPermissions.TEAM_TEAM_CAN_CHANGE_TEAM, user2)).toBe(true);
  });
  it('can have all perms in the team which he/she is a coach =>', () => {
    const user = new FakeUserModelFactory();
    project.permissions = [
      StaticPermissions.PROJECT_PROJECT_VIEW_PROJECT];
    team.permissions = [
      StaticPermissions.TEAM_PERMS_COACH_TEAM,
      StaticPermissions.TEAM_PERMS_FULL_VIEW_TEAM];
    expect(hasTeamPerm(project, team, StaticPermissions.TEAM_TEAM_CAN_CHANGE_TEAM, user)).toBe(true);
  });
  it('can have custom perms for some object related with a team =>', () => {
    const user = new FakeUserModelFactory();
    project.permissions = [
      StaticPermissions.PROJECT_PROJECT_VIEW_PROJECT];
    team.permissions = [
      StaticPermissions.TEAM_PERMS_FULL_VIEW_TEAM];
    expect(hasTeamPerm(project, team, StaticPermissions.TEAM_TEAM_CAN_CHANGE_TEAM, user)).toBe(false);
  });
});
