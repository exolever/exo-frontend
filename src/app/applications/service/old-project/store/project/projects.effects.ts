import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { ProjectService } from '@applications/service/old-project/services/project.service';
import { ProjectWebsocketService } from '@applications/service/old-project/services/project-websocket.service';

import * as projectActions from './projects.actions';

@Injectable()
export class ProjectsEffects {

  @Effect()
  getProject$: Observable<Action> = this.actions$.pipe(
    ofType(projectActions.GET_PROJECT),
    switchMap((res: projectActions.GetProject) => this.projectService.getProject(res.payload).pipe(
      map((projects) => {
        const project = projects.pop();
        this.websocket.getMessages().subscribe();
        return new projectActions.GetProjectSuccess(project);
      }),
      catchError(error => observableOf(new projectActions.GetProjectFail(error)))
    )),
  );

  @Effect({ dispatch: false })
  initProject$: Observable<Action> = this.actions$.pipe(
    ofType(projectActions.INIT_PROJECT),
    tap((action: projectActions.InitProject) => this.websocket.subscribe(action.payload.pk)),
  );

  constructor(
    private actions$: Actions,
    private projectService: ProjectService,
    private websocket: ProjectWebsocketService
  ) { }

}
