import { PermissionMixin } from '@core/models/permission.model';

import * as MomentTZ from 'moment-timezone';

import { UsersServiceRoles } from '@applications/service/shared/interfaces/roles.interface';

import { TeamModel } from './team.model';


export class ProjectModel extends PermissionMixin {
  // service info
  pk: string;
  name: string;
  steps: Array<string>;
  teams: Array<string>;
  typeProject: string;
  template: string;
  customerName: string;
  nextUrl: string;
  ticketsModuleEnabled: boolean;
  swarmSessionsModuleEnabled?: boolean;
  teamCommunicationsModuleEnabled?: boolean;
  askEcosystemEnabled?: boolean;
  directoryEnabled?: boolean;
  myTeams: Array<TeamModel>;
  teamSelected: TeamModel;
  uuid: string;

  // dates
  firstDay: MomentTZ.Moment;
  lastDay: MomentTZ.Moment;

  // location
  location: string;
  timezone: string;

  // members
  usersRoles: UsersServiceRoles[];
  consultantsRoles: UsersServiceRoles[];

  // permissions
  allowedAccess: boolean;

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }

  /**
   * receives the pk of the users and returns the role within the project
   * @param participantPk
   */
  getParticipantRole(participantPk: string): string {
    const errMessage = 'ROLE NOT FOUND';

    const consultantRole =
      this.consultantsRoles.filter((cRole: UsersServiceRoles) => cRole.consultantPk === participantPk );
    if (consultantRole.length) {
      return 'SERVICE.ROLES.' + consultantRole[0].roleCode;
    }
    const participantRole =
      this.usersRoles.filter((pRole: UsersServiceRoles) => pRole.userPk === participantPk );
    if (participantRole.length) {
      return 'SERVICE.ROLES.MEMBER';
    }

    return errMessage;
  }

  getTypeProject(): string {
    return this.typeProject;
  }
}

