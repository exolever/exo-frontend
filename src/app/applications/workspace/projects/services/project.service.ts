import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as MomentTZ from 'moment-timezone';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiResources as ApiUrls, UrlService, UserModel } from '@app/core';
import { Pagination } from '@core/interfaces/pagination.interface';

import { GenericProject } from '../models/project.model';
import { AdvisoryCallSettingsInterface } from '../models/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  createProject(data): Observable<GenericProject> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECTS_LIST);
    const dataFormated = {...data, ...{start:  MomentTZ(data.start).format('YYYY-MM-DD')}};
    return this.http.post<GenericProject>(apiUrl, dataFormated).pipe(
      map(response => new GenericProject(response))
    );
  }

  editProject(data: GenericProject): Observable<GenericProject> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_DETAIL, data.pk);
    const dataFormated = {...data, ...{start: MomentTZ(data.start).format('YYYY-MM-DD')}};
    return this.http.put<GenericProject>(apiUrl, dataFormated).pipe(
      map(response => new GenericProject(response))
    );
  }

  changeSettings(data: GenericProject): Observable<GenericProject> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_SETTINGS, data.pk);
    return this.http.put<GenericProject>(apiUrl, data.settings).pipe(
      map(response => new GenericProject(response))
    );
  }

  getAdvisoryCallSettings(pk: number): Observable<AdvisoryCallSettingsInterface> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_ADVISORY_CALL_SETTINGS, pk);
    return this.http.get<AdvisoryCallSettingsInterface>(apiUrl);
  }

  changeAdvisoryCallSettings(
    data: AdvisoryCallSettingsInterface, projectPk: number
  ): Observable<AdvisoryCallSettingsInterface> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_ADVISORY_CALL_SETTINGS, projectPk);
    return this.http.put<AdvisoryCallSettingsInterface>(apiUrl, data);
  }

  deleteProject(data: GenericProject): Observable<GenericProject> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_DETAIL, data.pk);
    return this.http.delete<GenericProject>(apiUrl).pipe(map(() => data));
  }

  getProjects(params: {
    pageIndex: number;
    pageSize: number;
    searchBy: string;
    sortBy: string;
  }): Observable<Pagination<GenericProject>> {
    let apiUrl = this.urlService.resolve(ApiUrls.PROJECTS_LIST);
    const paramKeys = ['page', 'page_size', 'search', 'sort'];
    const paramValues = [params.pageIndex, params.pageSize, params.searchBy, params.sortBy];

    apiUrl = this.urlService.resolveGetParams(apiUrl, paramKeys, paramValues);
    return this.http.get<Pagination<GenericProject>>(apiUrl)
      .pipe(
        tap((response: Pagination<GenericProject>) =>
          (response.results = response.results.map(project => new GenericProject(project)))
        )
      );
  }

  getAllProjects(): Observable<GenericProject[]> {
    return this.getProjects({pageSize: 1000, pageIndex: 1, searchBy: '', sortBy: ''}).pipe(
      map(response => response.results)
    );
  }

  getProjectDetails(pk: number): Observable<GenericProject> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_DETAIL, pk);
    return this.http.get<GenericProject>(apiUrl).pipe(
      map((response) => new GenericProject(response))
    );
  }

  getUnassignedUsers(projectPk: number): Observable<{user: UserModel, projectRoles: Array<number>}[]> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_UNASSIGNED_USERS, projectPk);
    return this.http.get<{user: UserModel, projectRoles: Array<number>}[]>(apiUrl);
  }

  publish(projectPk: number, message: string): Observable<GenericProject> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_PUBLISH, projectPk);
    return this.http.put<GenericProject>(apiUrl, {message: ''.concat(message)}).pipe(
      map((response) => new GenericProject(response))
    );
  }
}
