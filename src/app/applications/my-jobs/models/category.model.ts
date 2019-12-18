import { RoleCategoryEnum } from '@core/modules/roles/enums/role-category.enum';

// TODO: this model should be place in the core module and be used in badges, my jobs and opportunities
export class CategoryModel {

  code: RoleCategoryEnum;
  name: string;
  description: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
