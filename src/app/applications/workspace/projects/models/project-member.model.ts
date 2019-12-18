import { UserModel } from '@core/models/user/user.model';
import { TeamRoleInterface } from './project.interface';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';
import { ProjectMemberActionsEnum } from '../projects.enum';
import { RolesInterface } from '@core/modules/roles/interfaces/roles.interface';

export class ProjectMember {
  pk: number;
  user: UserModel;
  teamRoles: TeamRoleInterface[] = [];
  projectRoles: RolesInterface[] = [];
  actions: ProjectMemberActionsEnum[] = [];

  constructor(obj?) {
    if (obj) {
      Object.assign(this, obj);
      this.user = new UserModel(obj.user);

      this.projectRoles = obj.projectRoles ? obj.projectRoles.map(r => ({
        code: r.code,
        name: r.name,
      })) : [];

      this.teamRoles = obj.teams ? obj.teams.map(t => ({
        exoRole: t.exoRole,
        teamPk: t.teamPk,
        name: t.name,
      })) : [];

    }
  }

  isParticipant(): boolean {
    return this.projectRoles.some(pR => pR.code === SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT);
  }

  canEdit(): boolean {
    return this.canEditOnlyTeamForParticipants() ||
      this.canEditUserDataForParticipants() ||
      this.canEditCollaborator();
  }

  canEditUserDataForParticipants() {
    return this.actions.includes(ProjectMemberActionsEnum.EDIT_USER_DATA_FOR_PARTICIPANT);
  }

  canEditOnlyTeamForParticipants() {
    return this.actions.includes(ProjectMemberActionsEnum.EDIT_TEAM_FOR_PARTICIPANT);
  }

  canDelete() {
    return this.actions.includes(ProjectMemberActionsEnum.DELETE_MEMBER);
  }

  canEditCollaborator() {
    return this.actions.includes(ProjectMemberActionsEnum.EDIT_COLLABORATOR);
  }

}
