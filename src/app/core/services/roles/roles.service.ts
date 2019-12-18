import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources, UrlService } from '@core/services';
import { RoleCategoryModel } from '@core/modules/roles/models';
import { RolesDeserializerService } from './roles-deserializer.service';

@Injectable()
export class RolesService {

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
    private rolesDeserializerService: RolesDeserializerService
  ) {}

  public getRoles(): Observable<RoleCategoryModel[]> {
    const url = this.urlService.resolveAPI(ApiResources.ROLES);
    return this.httpClient.get<RoleCategoryModel[]>(url).pipe(
      map((res) => this.rolesDeserializerService.deserialize(res)));
  }
}
