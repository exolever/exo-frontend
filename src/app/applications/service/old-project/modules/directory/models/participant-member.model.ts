import { UserApplicationModel, LanguageModel, IndustryModel } from '@applications/shared/models';

import { StatusMember, IMemberModel, getStatus, setRoleRelation, addTeam } from './member.model';

export class ParticipantMemberModel extends UserApplicationModel implements IMemberModel {
  public role: string;
  public roleCode: string;
  public teams: Array<string> = [];
  public status: StatusMember;

  getStatus(): StatusMember {
    return getStatus(this);
  }
  setRoleRelation(roleCode: string, roleName: string, status: StatusMember) {
    setRoleRelation(this, roleCode, roleName, status);
  }
  addTeam( pkTeam: string ) {
    addTeam( this, pkTeam );
  }
  isConsultant(): boolean {
    return false;
  }
  isParticipant(): boolean {
    return true;
  }
  getIndustries(): Array<IndustryModel> {
    return [];
  }
  getLanguages(): Array<LanguageModel> {
    return [];
  }
  hasLanguages(): boolean {
    return this.getLanguages().length > 0;
  }
  hasIndustries(): boolean {
    return this.getIndustries().length > 0;
  }
}
