import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UrlService, ApiResources } from '@core/services';
import { Team as TeamModel} from '@applications/workspace/projects/models/team.model';


@Injectable()
export class TeamsService {
  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  getTeams(projectPk: number): Observable<TeamModel[]> {
    const apiUrl = this.urlService.resolve(ApiResources.GENERIC_PROJECT_TEAMS, projectPk);
    return this.http.get<TeamModel[]>(apiUrl).pipe(
      map(response => response.map(r => new TeamModel(r)))
    );
  }

  getDetails(projectPk: number, teamPk: number): Observable<TeamModel> {
    const apiUrl = this.urlService.resolve(ApiResources.PROJECT_TEAM_DETAIL, projectPk, teamPk);
    return this.http.get<TeamModel>(apiUrl).pipe(map(response => new TeamModel(response)));
  }

}
