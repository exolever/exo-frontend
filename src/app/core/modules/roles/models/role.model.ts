import { RoleEnum, SprintRoleEnum, OtherRoleEnum } from '@core/modules/roles/enums/role.enum';
import { CertificationEnum } from '@core/modules/certifications/enums';

export class RoleModel {

  constructor(data: any) {
    Object.assign(this, data);
  }

  code: RoleEnum;
  name: string;
  certifications?: CertificationEnum[];

  isOtherRole(): boolean {
    return [
      SprintRoleEnum.OTHER_SPRINT,
      OtherRoleEnum.OTHER_OTHER
    ].includes(<any>this.code);
  }

}
