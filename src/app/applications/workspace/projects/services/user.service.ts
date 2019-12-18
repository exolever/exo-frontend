import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { ApiResources as ApiUrls, UrlService } from '@app/core';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ProjectMember } from '../models/project-member.model';



@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  getUsers(projectPk: number, params: {
    pageIndex: number;
    pageSize: number;
    searchBy: string;
  }): Observable<Pagination<ProjectMember>> {
    const paramKeys = ['page', 'page_size', 'search'];
    const paramValues = [params.pageIndex, params.pageSize, params.searchBy];

    let apiUrl = this.urlService.resolve(ApiUrls.PROJECT_MEMBERS, projectPk);
    apiUrl = this.urlService.resolveGetParams(apiUrl, paramKeys, paramValues);
    return this.http.get<Pagination<ProjectMember>>(apiUrl).pipe(
      tap((response: Pagination<ProjectMember>) =>
        (response.results = response.results.map(user => new ProjectMember(user)))
      )
    );
  }

  createCollaborator(projectPk: number, data): Observable<ProjectMember> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_CREATE_COLLABORATOR, projectPk);
    return this.http.post<ProjectMember>(apiUrl, data).pipe(
      map(response => new ProjectMember(response))
    );
  }

  createParticipant(projectPk: number, data): Observable<ProjectMember> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_CREATE_PARTICIPANT, projectPk);
    return this.http.post<ProjectMember>(apiUrl, data).pipe(
      map(response => new ProjectMember(response))
    );
  }

  editCollaborator(projectPk: number, userUuid: string, data): Observable<ProjectMember> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_EDIT_COLLABORATOR, projectPk, userUuid);
    return this.http.put<ProjectMember>(apiUrl, data).pipe(
      map(response => new ProjectMember(response))
    );
  }

  editParticipant(projectPk: number, userUuid: string, data): Observable<ProjectMember> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_EDIT_PARTICIPANT, projectPk, userUuid);
    return this.http.put<ProjectMember>(apiUrl, data).pipe(
      map(response => new ProjectMember(response))
    );
  }

  editParticipantTeams(projectPk: number, userUuid: string, data): Observable<ProjectMember> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_EDIT_PARTICIPANT_TEAMS, projectPk, userUuid);
    return this.http.put<ProjectMember>(apiUrl, data).pipe(
      map(response => new ProjectMember(response))
    );
  }


  deleteUser(projectPk: number, member: ProjectMember): Observable<ProjectMember> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_MEMBER_DETAIL, projectPk, member.user.uuid);
    return this.http.delete<ProjectMember>(apiUrl).pipe(map(() => member));
  }

  parseParticipantsFile(projectPk: number, fileIdentifier: string): Observable<{name: string, email: string}[]> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_PARSE_UPLOAD_BULK_PARTICIPANTS, projectPk);
    return this.http.post<{name: string, email: string}[]>(apiUrl, {'filename': fileIdentifier});
  }

  uploadParticipantsInBulk(
    projectPk: number, data: {teams: number[], users: {name: string, email: string}[]}
  ): Observable<any> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_UPLOAD_PARTICIPANTS_BULK, projectPk);
    return this.http.post<{name: string, email: string}[]>(apiUrl, data);
  }

}
