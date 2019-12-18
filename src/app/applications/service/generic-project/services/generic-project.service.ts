import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UrlService, ApiResources } from '@core/services';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { Team as TeamModel } from '@applications/workspace/projects/models/team.model';
@Injectable()
export class GenericProjectService {
  constructor(
    private http: HttpClient,
    private urlService: UrlService,
  ) { }

  getGenericProject(projectPk: number):  Observable<{project: GenericProject, teams: TeamModel[]}> {
    const apiUrl = this.urlService.resolve(ApiResources.GET_GENERIC_PROJECT, projectPk);
    return this.http.get<{project: GenericProject, teams: TeamModel[]}>(apiUrl).pipe(
      map(response => ({project: new GenericProject(response), teams: response.teams.map(t => new TeamModel (t))}))
    );
  }

}


