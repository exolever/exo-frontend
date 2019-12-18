import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

import { TeamService } from '../../services/team.service';
import { TeamModel } from '../../models/team.model';
import * as teamsActions from './team.action';
import { LoadTeams } from './team.action';

@Injectable()
export class TeamsEffect {

  @Effect()
  loadTeams$ = this.actions$.pipe(
    ofType(teamsActions.LOAD_TEAMS),
    switchMap((res: LoadTeams) => this.teamService.getTeams(res.payload).pipe(
      map((teams: TeamModel[]) => new teamsActions.LoadTeamsSuccess(teams)),
      catchError(error => observableOf(new teamsActions.LoadTeamsFail(error)))
    )),
  );

  constructor(
    private actions$: Actions,
    private teamService: TeamService
  ) {}
}
