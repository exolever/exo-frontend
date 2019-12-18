import { RoleCategoryEnum } from '@core/modules/roles/enums';
import { RoleModel } from '@core/modules/roles/models';

export interface RoleCategoryInterface {
  code: RoleCategoryEnum;
  roles: RoleModel[];
  name: string;
  description: string | null;
}
