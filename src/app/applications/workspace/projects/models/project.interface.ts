import * as MomentTZ from 'moment-timezone';

import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';
import { RolesInterface } from '@core/modules/roles/interfaces/roles.interface';
import { BudgetInterface } from '@applications/ecosystem/modules/opportunities/models/opportunity.interface';
import { OpportunityDurationUnit } from '@applications/ecosystem/modules/opportunities/models/opportunity.enum';
import { StreamProjectEnum, ProjectMemberActionsEnum } from '../projects.enum';
import { ProjectMember } from './project-member.model';


export interface GenericDataInterface {
  name: string;
  location: string;
  placeId: string;
  start: MomentTZ.Moment;
  customer?: string;
}

export interface StreamInterface {
  code: StreamProjectEnum;
  pk: string;
  name: string;
}

export interface TeamRoleInterface {
  exoRole: { name: string, code: SprintRoleEnum; description?: null | string };
  teamPk: number;
  name: string;
}

export interface TeamMemberRoleInterface {
  pk: number;
  uuidUser: string;
  role: RolesInterface;
  projectMember?: ProjectMember;
  userActions: ProjectMemberActionsEnum[];
}

export interface AdvisoryCallSettingsInterface {
  total: number;
  budgets: BudgetInterface[];
  durationUnity: OpportunityDurationUnit;
  durationValue: number;
}

