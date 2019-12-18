import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Pagination } from '@core/interfaces/pagination.interface';
import { AppState } from '@core/store/reducers';

import { MembersService } from '../../services/members.service';
import * as fromState from '../reducer/index';
import * as MemberActions from '../actions/members.action';

@Injectable()
export class MembersEffect {
  @Effect()
  loadingGProjectMembers$: Observable<Action> = this.actions$
    .pipe(
      ofType(MemberActions.TypeActionEnum.LOAD_MEMBERS_GENERIC_PROJECT),
      withLatestFrom(
        this.store$.pipe(select(state => fromState.selectSearchByMembers(state.genericProject))),
        this.store$.pipe(select(state => fromState.selectPageIndexMembers(state.genericProject))),
        this.store$.pipe(select(state => fromState.selectPageSizeMembers(state.genericProject))),
      ),
      switchMap(([action, searchBy, index, size]: [MemberActions.LoadGProjectMembers, string, number, number]) =>
        this.membersService.getMembers(action.payload, {
          searchBy: searchBy,
          pageIndex: index + 1,
          pageSize: size
        }).pipe(
          catchError(error => this.notify(new MemberActions.LoadGProjectMembersFail(error), true)),
          map((response: Pagination<any>) => new MemberActions.LoadGProjectMembersSuccess(response))
        )
      )
  );

  @Effect()
  searchingGProjectMembers$: Observable<Action> = this.actions$
    .pipe(
      ofType(MemberActions.TypeActionEnum.SEARCH_MEMBERS_GENERIC_PROJECT),
      map((action: MemberActions.SetSearchGProjectMembers) =>
        new MemberActions.LoadGProjectMembers(action.payload.projectPk))
  );

  @Effect()
  paginatingGProjectMembers$: Observable<Action> = this.actions$
    .pipe(
      ofType(MemberActions.TypeActionEnum.SET_PAGINATION_MEMBERS_GENERIC_PROJECT),
      map((action: MemberActions.SetPaginationGProjectMembers) =>
        new MemberActions.LoadGProjectMembers(action.payload.projectPk))
  );

  constructor(
    private actions$: Actions,
    private membersService: MembersService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private store$: Store<AppState>,
  ) { }

  private notify(action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('COMMON.ERRORS.GENERIC'),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
