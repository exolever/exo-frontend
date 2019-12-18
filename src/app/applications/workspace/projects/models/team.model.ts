import { RolesInterface } from '@core/modules/roles/interfaces/roles.interface';
import { TeamMemberRoleInterface, StreamInterface } from './project.interface';
import { TeamActionsEnum } from '../projects.enum';

export class Team {
  pk: number;
  name: string;
  image: string;
  stream: StreamInterface;
  users: Array<TeamMemberRoleInterface> = [];
  userActions: TeamActionsEnum[] = [];
  roles: RolesInterface[] = [];

  // Manage advisory calls
  groupUuid: string;

  constructor(obj?) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
