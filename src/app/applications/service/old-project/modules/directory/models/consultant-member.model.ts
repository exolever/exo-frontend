import { ConsultantModel, LanguageModel, IndustryModel } from '@applications/shared/models/';

import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';
import { StatusMember, IMemberModel, getStatus, setRoleRelation, addTeam } from './member.model';


export class ConsultantMemberModel extends ConsultantModel implements IMemberModel {
  public role: string;
  public roleCode: string;
  public teams: Array<string> = [];
  public status: StatusMember;

  constructor(pk: string) {
    super(pk);
  }

  getStatus(): StatusMember {
    return getStatus(this);
  }
  setRoleRelation(roleCode: string, roleName: string, status: StatusMember) {
    setRoleRelation(this, roleCode, roleName, status);
  }
  addTeam(pkTeam: string) {
    addTeam(this, pkTeam);
  }
  isCoach(): boolean {
    return SprintRoleEnum[this.roleCode] === SprintRoleEnum.SPRINT_COACH_SPRINT;
  }
  isConsultant(): boolean {
    return true;
  }
  isParticipant(): boolean {
    return false;
  }
  getIndustries(): Array<IndustryModel> {
    return this.industries;
  }
  getLanguages(): Array<LanguageModel> {
    return this.languages;
  }
  hasLanguages(): boolean {
    return this.getLanguages().length > 0;
  }
  hasIndustries(): boolean {
    return this.getIndustries().length > 0;
  }
}
