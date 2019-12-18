import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiResources as ApiUrls, UrlService } from '@app/core';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ProjectMember } from '@applications/workspace/projects/models/project-member.model';

@Injectable()
export class MembersService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  getMembers(projectPk: number, params: {
    pageIndex: number;
    pageSize: number;
    searchBy: string;
  }): Observable<Pagination<ProjectMember>> {
    const paramKeys = ['page', 'page_size', 'search'];
    const paramValues = [params.pageIndex, params.pageSize, params.searchBy];

    let apiUrl = this.urlService.resolve(ApiUrls.GET_GENERIC_PROJECT_MEMBERS, projectPk);
    apiUrl = this.urlService.resolveGetParams(apiUrl, paramKeys, paramValues);
    return this.http.get<Pagination<ProjectMember>>(apiUrl).pipe(
      tap((response: Pagination<ProjectMember>) =>
        (response.results = response.results.map(user => new ProjectMember(user)))
      )
    );
  }
}
