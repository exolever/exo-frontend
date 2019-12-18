import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action, Store, select  } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { AppState } from '@core/store/reducers';
import { Urls, UrlService } from '@app/core';
import { Pagination } from '@core/interfaces/pagination.interface';

import { GenericProject } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import * as ProjectsActions from '../action/projects.action';
import * as fromState from '../reducer/index';


@Injectable()
export class ProjectsEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.LOAD),
      withLatestFrom(
        this.store$.pipe(select(state => fromState.selectSearchBy(state.workspaceProjects))),
        this.store$.pipe(select(state => fromState.selectPageIndexProject(state.workspaceProjects))),
        this.store$.pipe(select(state => fromState.selectPageSizeProject(state.workspaceProjects))),
        this.store$.pipe(select(state => fromState.selectSortBy(state.workspaceProjects)))
      ),
      switchMap(([_, searchBy, index, size, sortBy]: [ProjectsActions.Load, string, number, number, string]) =>
        this.projectsService.getProjects({
          pageIndex: index + 1,
          pageSize: size,
          searchBy: searchBy,
          sortBy: sortBy
        }).pipe(
          catchError(error => this.notify('WRONG', new ProjectsActions.LoadFail(error), true)),
          map((response: Pagination<GenericProject>) => new ProjectsActions.LoadSuccess(response))
        )
      )
  );

  @Effect()
  loadingDetails$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.LOAD_DETAIL),
      switchMap((action: ProjectsActions.LoadDetails) =>
        this.projectsService.getProjectDetails(action.payload)
      ),
      map(response => new ProjectsActions.LoadDetailsSuccess(response))
  );

  @Effect()
  creating$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.CREATE),
      switchMap((action: ProjectsActions.Create) => this.projectsService.createProject(action.payload)
        .pipe(
          map((response) => {
            const url = this.urlService.getPath([Urls.ECOSYSTEM_WORKSPACE_PROJECTS_EDIT, response.pk.toString()]);
            this.router.navigate([url]);
            return this.notify('CREATE.SUCCESS', new ProjectsActions.CreateSuccess(response), false);
          }),
          catchError(error => this.notify('WRONG', new ProjectsActions.CreateFail(error), true))
        )
      )
  );

  @Effect()
  editing$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.EDIT),
      switchMap((action: ProjectsActions.Edit) => this.projectsService.editProject(action.payload)
        .pipe(
          map((response) => this.notify('EDIT.SUCCESS', new ProjectsActions.EditSuccess(response), false)),
          catchError(error => this.notify('WRONG', new ProjectsActions.EditFail(error), true))
        )
      )
  );

  @Effect()
  settings$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.SETTINGS),
      switchMap((action: ProjectsActions.Settings) => this.projectsService.changeSettings(action.payload)
        .pipe(
          map((response) => this.notify('FORM.SETTINGS.SUCCESS', new ProjectsActions.SettingsSuccess(response), false)),
          catchError(error => this.notify('WRONG', new ProjectsActions.SettingsFail(error), true))
        )
      )
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.DELETE),
      switchMap((action: ProjectsActions.Delete) =>
        this.projectsService.deleteProject(action.payload).pipe(
          map((response) =>
            this.notify('DELETE_OK', new ProjectsActions.DeleteSuccess(response.pk), false)),
          catchError(error => this.notify('WRONG', new ProjectsActions.DeleteFail(error), true))
        )
      )
  );

  @Effect()
  searching$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.SEARCH),
      map((action: ProjectsActions.SetSearch) => new ProjectsActions.Load())
  );

  @Effect()
  paginating$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.SET_PAGINATION),
      map(() => new ProjectsActions.Load())
  );

  @Effect()
  sortBy$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.SORTBY),
      map(() => new ProjectsActions.Load())
  );

  @Effect()
  publishing$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProjectsActions.TypeActionEnum.PUBLISH),
      switchMap((action: ProjectsActions.Publish) =>
        this.projectsService.publish(action.payload.projectPk, action.payload.message).pipe(
          catchError(error => this.notify('WRONG', new ProjectsActions.PublishFail(error), true)),
          map((response: GenericProject) =>
            this.notify('PUBLISH_OK', new ProjectsActions.PublishSuccess(response), false)
          )
        )
      )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private projectsService: ProjectService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private urlService: UrlService,
    private router: Router,
  ) { }

  private notify(messageKey: string, action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.' + messageKey),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
