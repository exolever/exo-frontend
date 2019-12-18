import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResources as ApiUrls, UrlService } from '@app/core';
import { Team } from '../models/team.model';
import { Pagination } from '@core/interfaces/pagination.interface';
import { map } from 'rxjs/operators';


@Injectable()
export class TeamService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  getTeams(projectPk: number): Observable<Team[]> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_TEAMS, projectPk);
    return this.http.get<Pagination<Team>>(apiUrl).pipe(
      map(response => response.results.map(team => new Team(team)))
    );
  }

  createTeam(team: Team, projectPk: number): Observable<Team> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_TEAM_CREATE, projectPk);
    return this.http.post<Team>(apiUrl, {...team, stream: team.stream.pk});
  }

  editTeam(team: Team, projectPk: number): Observable<Team> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_TEAM_DETAIL, projectPk, team.pk);
    return this.http.put<Team>(apiUrl,  {...team, stream: team.stream.pk});
  }

  deleteTeam(team: Team, projectPk: number): Observable<Team> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_TEAM_DETAIL, projectPk, team.pk);
    return this.http.delete(apiUrl).pipe(map((_) => team));
  }

  unselectUser(team: Team, projectPk: number, teamRolePk: number): Observable<Team> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_TEAM_UNSELECT, projectPk, team.pk, teamRolePk);
    return this.http.delete<Team>(apiUrl).pipe(map((response) => new Team(response)));
  }

  moveUserToTeam(teamPk: number, projectPk: number, teamRolePk: number, newTeamPk: number): Observable<Team[]> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_TEAM_MOVE, projectPk, teamPk, teamRolePk);
    return this.http.put<Team[]>(apiUrl, {new_team: newTeamPk}).pipe(
      map((response) => response.map((obj: Team) => new Team(obj)))
    );
  }

  selectPeople(teamPk: number, projectPk: number, data: number[]): Observable<Team> {
    const apiUrl = this.urlService.resolve(ApiUrls.PROJECT_TEAM_SELECT_PEOPLE, projectPk, teamPk);
    return this.http.post<Team>(apiUrl, {project_roles: data}).pipe(map((response) => new Team(response)));
  }
}
