import * as MomentTZ from 'moment-timezone';
import { RoleCategoryEnum, RoleEnum } from '@core/modules/roles/enums';

export class BadgeModel {

  constructor(
    public role: RoleEnum,
    public category: RoleCategoryEnum,
    public num: number,
    public order: number,
    public created: MomentTZ.Moment,
    public activities?: Array<BadgeActivityModel>
  ) { }
}

export class BadgeActivityModel {
  constructor(
    public description: string,
    public date: MomentTZ.Moment
  ) { }
}
