import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { UserModel } from '@core/models/user/user.model';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';
import { SwarmSessionsService } from '../../services/swarm-sessions.service';
import * as QuestionActions from '../action/questions.action';
import * as SessionsActions from '../action/sessions.action';
import { defer } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class SessionsEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$
    .pipe(
      ofType(SessionsActions.TypeActionEnum.LOAD_SESIONS),
      switchMap((action: SessionsActions.LoadSessions) => this.sessionService.getSessionsList({
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject
      }).pipe(
        catchError(error => this.notify('WRONG', new SessionsActions.LoadSessionsFail(error))),
        map((response: SwarmSession[]) => new SessionsActions.LoadSessionsSuccess(response))
      )),
  );

  @Effect()
  selecting$: Observable<Action> = this.actions$
    .pipe(
      ofType(SessionsActions.TypeActionEnum.SELECT_SESSION),
      mergeMap((action: SessionsActions.SelectSession) => [
        new QuestionActions.LoadQuestions({
          pkProject: action.payload.pkProject,
          pkTeam: action.payload.pkTeam,
          pkSession: action.payload.pkSession,
          pageSize: 50,
          pageIndex: 1
        }),
        new SessionsActions.AddAdvisors({
          pkTeam: action.payload.pkTeam,
          pkProject: action.payload.pkProject,
          pkSession: action.payload.pkSession
        })
    ])
  );

  @Effect()
  addingAdivosrs$: Observable<Action> = this.actions$.pipe(
    ofType(SessionsActions.TypeActionEnum.ADD_ADIVSORS),
    switchMap((action: SessionsActions.AddAdvisors) => this.sessionService.getAdvisors({
      pkTeam: action.payload.pkTeam,
      pkProject: action.payload.pkProject,
      pkSession: action.payload.pkSession
    }).pipe(
      map(response => [response, action.payload.pkSession]),
      catchError(error => this.notify('WRONG', new SessionsActions.AddAdvisorsFail(error), true)),
      map(([response, pkSession ]: [UserModel[], number ]) => {
        if (response && pkSession) {
          return new SessionsActions.AddAdvisorsSuccess({advisors: response, pkSession: pkSession});
        }
      }))
    ),
  );

  @Effect()
  initConnectedUsers$: Observable<any> = this.actions$.pipe(
    ofType(SessionsActions.TypeActionEnum.ADD_USERS),
    switchMap((action: SessionsActions.InitConnectedUsers) => this.sessionService.getConnectedUsers().pipe(
      catchError(error => this.notify('WRONG', new SessionsActions.InitConnectedUsersFail(error))),
      map((users: string[]) => new SessionsActions.InitConnectedUsersSuccess(users))
    )),
  );

  @Effect({ dispatch: true })
  init$: Observable<any> = defer(() => of(null)).pipe(
    map(() => new SessionsActions.InitConnectedUsers())
  );

  constructor(
    private actions$: Actions,
    private sessionService: SwarmSessionsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  private notify(messageKey: string, action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('SWARM.' + messageKey),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
