import { IndustryModel } from '@applications/shared/models/industry.model';

export enum StatusMember {
  A = <any>'Active',
  I = <any>'Inactive'
}

export function setRoleRelation(obj, roleCode: string, roleName: string, status: StatusMember) {
  obj.roleCode = roleCode;
  obj.role = roleName;
  obj.status = status;
}

export function getStatus(obj): StatusMember {
  if (typeof obj.status === 'undefined') { obj.status = StatusMember.I; }
  return obj.status;
}

export function addTeam(obj, pkTeam: string) {
  obj.teams.push(pkTeam);
}

export interface IMemberModel {
  role: string;
  roleCode: string;
  teams: Array<string>;
  status: StatusMember;

  getStatus(): StatusMember;
  setRoleRelation(roleCode: string, roleName: string, status: StatusMember);
  addTeam(pkTeam: string);
  isConsultant(): boolean;
  isParticipant(): boolean;
  getIndustries(): Array<IndustryModel>;
  getLanguages();
  hasLanguages(): boolean;
  hasIndustries(): boolean;
}
