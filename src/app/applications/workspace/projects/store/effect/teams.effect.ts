import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';


import { TeamService } from '../../services/team.service';
import * as TeamActions from '../action/team.action';
import { Team } from '../../models/team.model';

@Injectable()
export class TeamsEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$
    .pipe(
      ofType(TeamActions.TypeActionEnum.LOAD),
      switchMap((action: TeamActions.Load) =>
        this.teamService.getTeams(action.payload).pipe(
          catchError(error => this.notify('WRONG', new TeamActions.LoadFail(error), true)),
          map((teams: Team[]) => new TeamActions.LoadSuccess(teams))
        ))
  );

  @Effect()
  creating$: Observable<Action> = this.actions$
    .pipe(
      ofType(TeamActions.TypeActionEnum.CREATE),
      switchMap((action: TeamActions.Create) =>
        this.teamService.createTeam(action.payload.team, action.payload.projectPk).pipe(
          catchError(error => this.notify('WRONG', new TeamActions.CreateFail(error), true)),
          map((team: Team) => new TeamActions.CreateSuccess(team))
        ))
  );

  @Effect()
  editing$: Observable<Action> = this.actions$
    .pipe(
      ofType(TeamActions.TypeActionEnum.EDIT),
      switchMap((action: TeamActions.Edit) =>
        this.teamService.editTeam(action.payload.team, action.payload.projectPk).pipe(
          map((response) => this.notify('EDIT', new TeamActions.EditSuccess(response), false)),
          catchError(error => this.notify('WRONG', new TeamActions.EditFail(error), true))
        ))
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$
    .pipe(
      ofType(TeamActions.TypeActionEnum.DELETE),
      switchMap((action: TeamActions.Delete) =>
        this.teamService.deleteTeam(action.payload.team, action.payload.projectPk).pipe(
          map((response) =>
            this.notify('DELETE', new TeamActions.DeleteSuccess(response.pk), false)),
          catchError(error => this.notify('WRONG', new TeamActions.DeleteFail(error), true))
        )
      )
  );

  @Effect()
  unselecting$: Observable<Action> = this.actions$
    .pipe(
      ofType(TeamActions.TypeActionEnum.UNSELECT),
      switchMap((action: TeamActions.Unselect) =>
        this.teamService.unselectUser(action.payload.team, action.payload.projectPk, action.payload.teamRolePk).pipe(
          map((response) => this.notify('UNSELECT_USER', new TeamActions.UnselectSuccess(response), false)),
          catchError(error => this.notify('WRONG', new TeamActions.UnselectFail(error), true))
        ))
  );

  @Effect()
  selecting$: Observable<Action> = this.actions$
    .pipe(
      ofType(TeamActions.TypeActionEnum.SELECT),
      switchMap((action: TeamActions.SelectPeople) =>
        this.teamService.selectPeople(action.payload.teamPk, action.payload.projectPk, action.payload.data).pipe(
          map((response) => this.notify('SELECT_PEOPLE', new TeamActions.SelectPeopleSuccess(response), false)),
          catchError(error => this.notify('WRONG', new TeamActions.SelectPeopleFail(error), true))
        ))
  );

  @Effect()
  moving$: Observable<Action> = this.actions$.pipe(
    ofType(TeamActions.TypeActionEnum.MOVE),
    switchMap((action: TeamActions.MoveUser) => this.teamService.moveUserToTeam(
      action.payload.teamPk,
      action.payload.projectPk,
      action.payload.teamUserRolePk,
      action.payload.newTeamPk
    ).pipe(
      map((response) => this.notify('MOVE_USER', new TeamActions.MoveUserSuccess(response), false)),
      catchError(error => this.notify('WRONG', new TeamActions.MoveUserFail(error), true))
    ))
  );

  constructor(
    private actions$: Actions,
    private teamService: TeamService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  private notify(messageKey: string, action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.TEAMS.TOASTS.' + messageKey),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
