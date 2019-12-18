import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, switchMap, tap, mergeMap } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';

import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { Team as TeamModel } from '@applications/workspace/projects/models/team.model';

import * as gProjectActions from '../actions/generic-project.action';
import * as teamActions from '../actions/teams.actions';
import { GenericProjectService } from '../../services/generic-project.service';
import { GenericProjectWebsocketService } from '../../services/generic-project-websocket.service';

@Injectable()
export class GenericProjectEffects {

  @Effect()
  getGProject$: Observable<Action> = this.actions$.pipe(
    ofType(gProjectActions.TypeActionEnum.GET_GPROJECT),
    switchMap((res: gProjectActions.GetGProject) => this.gProjectService.getGenericProject(res.payload).pipe(
      mergeMap((data: {project: GenericProject, teams: TeamModel[]}) => {
        this.websocket.getMessages().subscribe();
        return [
          new teamActions.LoadGProjectTeamsSuccess(data.teams),
          new gProjectActions.GetGProjectSuccess(data.project),
        ];
      }),
      catchError(error => observableOf(new gProjectActions.GetGProjectFail(error)))
    )),
  );

  @Effect({ dispatch: false })
  initGenericProject$: Observable<Action> = this.actions$.pipe(
    ofType(gProjectActions.TypeActionEnum.INIT_GPROJECT),
    tap((action: gProjectActions.InitGProject) => this.websocket.subscribe(action.payload.pk)),
  );

  constructor(
    private actions$: Actions,
    private gProjectService: GenericProjectService,
    private websocket: GenericProjectWebsocketService
  ) { }

}
