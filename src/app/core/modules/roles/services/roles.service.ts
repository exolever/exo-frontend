import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResources, UrlService } from '@app/core';
import { RoleCategoryModel, RoleModel } from '@core/modules/roles/models';
import { CategoryHelpCenter, RoleCategoryEnum } from '@core/modules/roles/enums';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
  ) { }

  public getRoles(): Observable<RoleCategoryModel[]> {
    const url = this.urlService.resolveAPI(ApiResources.ROLES);
    return this.httpClient.get<RoleCategoryModel[]>(url).pipe(
      map((res) => this.deserialize(res))
    );
  }

  public deserialize(data): RoleCategoryModel[] {
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

  public urlHelpCenter(value: RoleCategoryEnum) {
    switch (value) {
      case RoleCategoryEnum.ADVISOR_CALL:
        return CategoryHelpCenter.ADVISOR_CALL;
      case RoleCategoryEnum.FASTRACK:
        return CategoryHelpCenter.FASTRACK;
      case RoleCategoryEnum.WORKSHOP:
        return CategoryHelpCenter.WORKSHOP;
      case RoleCategoryEnum.DISRUPTION_SESSION:
        return CategoryHelpCenter.DISRUPTION_SESSION;
      case RoleCategoryEnum.CERTIFICATION_PROGRAM:
        return CategoryHelpCenter.CERTIFICATION_PROGRAM;
      case RoleCategoryEnum.SUMMIT:
        return CategoryHelpCenter.SUMMIT;
      case RoleCategoryEnum.SWARM:
        return CategoryHelpCenter.SWARM;
      case RoleCategoryEnum.KEYNOTE_PRESENTATION:
        return CategoryHelpCenter.KEYNOTE_PRESENTATION;
      case RoleCategoryEnum.SPRINT:
        return CategoryHelpCenter.SPRINT;
      case RoleCategoryEnum.OTHER:
      default:
        return CategoryHelpCenter.OTHER;
    }
  }
}
