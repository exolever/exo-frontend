import { UserModel } from '@core/models/user/user.model';
import { StaticPermissions } from '@core/services/acl/permissions';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { Team as TeamGProject } from '@applications/workspace/projects/models/team.model';

import { ProjectModel } from '../../old-project/models/project.model';
import { TeamModel } from '../../old-project/models/team.model';

export function hasTeamPerm(
  project: ProjectModel | GenericProject,
  team: TeamModel | TeamGProject,
  perm: string,
  user: UserModel, related?: any
): boolean {
  // you must be logged in
  if ( !user ) {
    return false;
  }
  /**
   * Superuser and project manager are allowed to do everything in the team
   * Team Coach is allowed to do everything in the team
   * Otherwise, only if user has the specific perm related with an object or the team.
  */
  // You have to be part of this project
  if (!user.hasPermissions(StaticPermissions.PROJECT_PROJECT_VIEW_PROJECT, project)) {
    return false;
  }
  // If you are superuser or project manager
  const cond1 = user.isSuperuser;
  const cond2 = user.hasPermissions(StaticPermissions.PROJECT_PROJECT_PROJECT_MANAGER, project);
  if (cond1 || cond2) {
    return true;
  }
  // You have to be part of the team
  if (!user.hasPermissions(StaticPermissions.TEAM_PERMS_FULL_VIEW_TEAM, team)) {
    return false;
  }
  // if you are the coach
  if (user.hasPermissions(StaticPermissions.TEAM_PERMS_COACH_TEAM, team)) {
    return true;
  }
  if (related !== undefined) {
    return user.hasPermissions(perm, related);
  } else {
    return user.hasPermissions(perm, team);
  }
}
