import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Pagination } from '@core/interfaces/pagination.interface';
import { AppState } from '@core/store/reducers';


import { UserService } from '../../services/user.service';
import { ProjectMember } from '../../models/project-member.model';
import * as fromState from '../reducer/index';
import * as UserActions from '../action/user.action';
import * as TeamActions from '../action/team.action';
import { GenericProject } from '../../models/project.model';
@Injectable()
export class UsersEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.LOAD),
      withLatestFrom(
        this.store$.pipe(select(state => fromState.selectSearchByUsers(state.workspaceProjects))),
        this.store$.pipe(select(state => fromState.selectPageIndexUsers(state.workspaceProjects))),
        this.store$.pipe(select(state => fromState.selectPageSizeUsers(state.workspaceProjects))),
      ),
      switchMap(([action, searchBy, index, size]: [UserActions.Load, string, number, number]) =>
        this.userService.getUsers(action.payload, {
          searchBy: searchBy,
          pageIndex: index + 1,
          pageSize: size
        }).pipe(
          catchError(error => this.notify('WRONG', new UserActions.LoadFail(error), true)),
          map((response: Pagination<ProjectMember>) => new UserActions.LoadSuccess(response))
        )
      )
  );

  @Effect()
  searching$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.SEARCH),
      map((action: UserActions.SetSearch) => new UserActions.Load(action.payload.projectPk))
  );

  @Effect()
  paginating$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.SET_PAGINATION),
      map((action: UserActions.SetPagination) => new UserActions.Load(action.payload.projectPk))
  );

  @Effect()
  creatingCollaborator$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.CREATE_COLLABORATOR),
      switchMap((action: UserActions.CreateCollaborator) =>
          this.userService.createCollaborator(action.payload.projectPk, action.payload.data)
        .pipe(
          map((response: ProjectMember) =>
            this.notify('CREATE_COLLABORATOR_SUCCESS', new UserActions.CreateCollaboratorSuccess(response), false)),
          catchError(error => this.notify('WRONG', new UserActions.CreateCollaboratorFail(error), true))
        )
      )
  );

  @Effect()
  editingCollaborator$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.EDIT_COLLABORATOR),
      withLatestFrom(
        this.store$.pipe(select(state => fromState.selectProjectSelected(state.workspaceProjects.projects)))
      ),
      switchMap(([action, project]: [UserActions.EditCollaborator, GenericProject]) =>
          this.userService.editCollaborator(action.payload.projectPk, action.payload.userUuid, action.payload.data)
        .pipe(
          switchMap((response: ProjectMember) => [
            this.notify('EDIT_COLLABORATOR_SUCCESS', new UserActions.EditCollaboratorSuccess(response), false),
            new TeamActions.Load(project.pk)
          ]),
          catchError(error => this.notify('WRONG', new UserActions.EditCollaboratorFail(error), true))
        )
      )
  );

  @Effect()
  creatingParticipant$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.CREATE_PARTICIPANT),
      withLatestFrom(
        this.store$.pipe(select(state => fromState.selectProjectSelected(state.workspaceProjects.projects)))
      ),
      switchMap(([action, project]: [UserActions.CreateParticipant, GenericProject]) =>
          this.userService.createParticipant(action.payload.projectPk, action.payload.data)
        .pipe(
          map((response: ProjectMember) =>
           this.notify('CREATE_PARTICIPANT_SUCCESS', new UserActions.CreateParticipantSuccess(response), false)),
          catchError(error => this.notify('WRONG', new UserActions.CreateParticipantFail(error), true))
        )
      )
  );

  @Effect()
  editingParticipant$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.EDIT_PARTICIPANT),
      switchMap((action: UserActions.EditParticipant) =>
          this.userService.editParticipant(action.payload.projectPk, action.payload.userUuid, action.payload.data)
        .pipe(
          switchMap((response: ProjectMember) => [
            this.notify('EDIT_PARTICIPANT_SUCCESS', new UserActions.EditParticipantSuccess(response), false),
            new TeamActions.Load(action.payload.projectPk),
          ]),
          catchError(error => this.notify('WRONG', new UserActions.EditParticipantFail(error), true))
        )
      )
  );

  @Effect()
  editingParticipantTeams$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.EDIT_PARTICIPANT_TEAMS),
      switchMap((action: UserActions.EditParticipantTeams) =>
          this.userService.editParticipantTeams(action.payload.projectPk, action.payload.userUuid, action.payload.data)
        .pipe(
          switchMap((response: ProjectMember) => [
            this.notify('EDIT_PARTICIPANT_SUCCESS', new UserActions.EditParticipantTeamsSuccess(response), false),
            new TeamActions.Load(action.payload.projectPk),
          ]),
          catchError(error => this.notify('WRONG', new UserActions.EditParticipantTeamsFail(error), true))
        )
      )
  );


  @Effect()
  deleting$: Observable<Action> = this.actions$
    .pipe(
      ofType(UserActions.TypeActionEnum.DELETE),
      switchMap((action: UserActions.Delete) =>
        this.userService.deleteUser(action.payload.projectPk, action.payload.member).pipe(
          map((response) =>
            this.notify('DELETE_SUCCESS', new UserActions.DeleteSuccess(action.payload.member.user.uuid), false)),
          catchError(error => this.notify('WRONG', new UserActions.DeleteFail(error), true))
        )
      )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private store$: Store<AppState>,
  ) { }

  private notify(messageKey: string, action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.' + messageKey),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
