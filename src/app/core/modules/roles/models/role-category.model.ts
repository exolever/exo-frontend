import { RoleCategoryEnum } from '@core/modules/roles/enums/role-category.enum';

import { RoleModel } from './role.model';

export class RoleCategoryModel {

  constructor(data: any) {
    Object.assign(this, data);
  }

  code: RoleCategoryEnum;
  roles: RoleModel[];
  name: string;
  description: string | null;

  isOtherCategory(): boolean {
    return this.code === RoleCategoryEnum.OTHER;
  }

}
