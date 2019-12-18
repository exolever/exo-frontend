import { Injectable } from '@angular/core';
import { RoleCategoryModel, RoleModel } from '@core/modules/roles/models';

@Injectable({
  providedIn: 'root'
})
export class RolesDeserializerService {

  deserialize(data: any): RoleCategoryModel[] {
    return data.map(categoryData => {
      const category = new RoleCategoryModel(categoryData);
      category.roles = category.roles.map((roleData: any) => {
        const role = new RoleModel(roleData);
        role.certifications = roleData.certifications;
        return role;
      });
      return category;
    });
  }
}
