import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as userActions from '@core/store/user/user.action';
import * as fromUser from '@core/store/user/user.reducer';
import { UserResponseInterface } from '@core/interfaces/network/user-response.interface';
import { UserWebsocketService } from '@core/services/user/user-websocket.service';

import { UserModel } from '../../models/user/user.model';
import { ApiResources, UrlService } from '../api/resolve';

@Injectable()
export class UserService {
  user$: Observable<UserModel>;

  constructor(
    private store: Store<AppState>,
    private authHttp: HttpClient,
    private urlService: UrlService,
    private websocket: UserWebsocketService
  ) {
    this.user$ = this.store.pipe(
      select(state => fromUser.getUser(state)),
      filter(user => user !== undefined)
    );
  }

  getUser(urlToNavigate?: string): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.ABOUT_ME);
    return this.authHttp.get<UserResponseInterface[]>(url).pipe(
      tap((userRes: UserResponseInterface[]) => this.updateUserStore(userRes[0], urlToNavigate)),
      map((userRes: UserResponseInterface[]) => new UserModel(userRes[0]))
    );
  }

  updateUserStore( user: UserResponseInterface, urlToNavigate?: string ): void {
    if (urlToNavigate  && !this.allowNavigation(user.status, urlToNavigate)) {
      this.store.dispatch(new userActions.LogoutUser());
    } else {
      this.store.dispatch(new userActions.UpdateUser(new UserModel(user)));
      this.websocket.getMessages().subscribe();
    }
  }

  allowNavigation(status: string, urlToNavigate?: string): boolean {
    const pendingStatus = 'P';
    const onboardingUrls = [
      'auth/signup/',
      'signup/agreement',
      'signup/profile'
    ];
    const allowedUrl = onboardingUrls.filter(url => urlToNavigate.match(`/${url}/[a-zA-Z0-9]+`)).length > 0;
    return status !== pendingStatus ? true : allowedUrl ? true : false;
  }
}

