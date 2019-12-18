import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, tap, filter } from 'rxjs/operators';
import * as Sentry from '@sentry/browser';

import { environment } from '@environments/environment';
import { UserService, UserModel } from '@app/core';
import { UserWebsocketService } from '@core/services/user/user-websocket.service';
import { LogoutService } from '@app/core/services/user/logout.service';
import { LanguageService } from '@applications/shared/services';
import { LANGUAGES_CONF } from '@app/app-config';
import { TrackingService } from '@core/services/tracking/tracking.service';

import * as userActions from './user.action';

@Injectable()
export class UserEffect {

  @Effect()
  getUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.GET_USER),
    switchMap(() => this.userService.getUser().pipe(
      map(user => new userActions.GetUserSuccess(user)),
      catchError(error => observableOf(new userActions.GetUserFail(error)))
    )),
  );

  @Effect({ dispatch: false })
  logoutUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.LOGOUT_USER),
    switchMap(() => this.logoutService.logout()),
    map(() => new userActions.LogoutUserSuccess())
  );

  @Effect()
  initUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.INIT_USER),
    tap(() => this.websocket.subscribe()),
    map((action: userActions.InitUser) => action.payload),
    tap((user: UserModel) => this.updateLocalStorageLanguage(user)),
    map((user: UserModel) => new userActions.UpdateUser(user))
  );

  @Effect({ dispatch: false })
  initUserInProduction$: Observable<UserModel> = this.actions$.pipe(
    ofType(userActions.INIT_USER),
    filter(() => environment.production === true),
    map((action: userActions.InitUser) => action.payload),
    tap((user: UserModel) => {
      Sentry.configureScope((scope) => {
        scope.setUser({
          'email': user.email,
          'id': user.pk,
          'name': user.fullName
        });
      });
    }),
    tap((user: UserModel) => this.tracking.identify(user))
  );

  constructor(
    private tracking: TrackingService,
    private actions$: Actions,
    private userService: UserService,
    private logoutService: LogoutService,
    private websocket: UserWebsocketService
  ) { }

  updateLocalStorageLanguage(user): void {
    if (!localStorage.getItem(LANGUAGES_CONF.KEY_LOCALSTORAGE)) {
      localStorage.setItem(LANGUAGES_CONF.KEY_LOCALSTORAGE, user.language
        ? user.language
        : LanguageService.getLocale());
    }
  }
}
