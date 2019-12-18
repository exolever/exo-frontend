import { RoleCategoryEnum, RoleEnum } from '@core/modules/roles/enums';

export interface BadgeResponseInterface {
  code: RoleEnum;
  category: RoleCategoryEnum;
  num: number;
  order: number;
  created: string;
  items: Array<BadgeActivityResponseInterface>;
}

export interface BadgeActivityResponseInterface {
  name: string;
  date: string;
}
