import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, tap, map } from 'rxjs/operators';

import { WebSocketPayload } from '@applications/sockets/config/config';
import { AppState } from '@core/store/reducers';
import { LocalStorageService} from '@app/core';
import { UserService } from '@core/services';
import { UserModel } from '@core/models/user/user.model';
import * as userActions from '@core/store/user/user.action';
import * as certifiactionsActions from '@core/modules/certifications/store/certifications.action';
import * as rolesActions from '@core/modules/roles/store/roles.action';
import { SocketService } from '@applications/sockets/service/socket.service';

@Injectable()
export class LoggedUserResolver implements Resolve<any> {

  constructor(
    private loggedUserService: UserService,
    private socketService: SocketService,
    private localStorage: LocalStorageService,
    private store: Store<AppState>,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserModel> {
    this.store.dispatch(new rolesActions.GetRoles());
    this.store.dispatch(new certifiactionsActions.GetCertifications());
    this.manageWS();
    return this.loggedUserService.getUser(state.url).pipe(
      tap(user => this.store.dispatch(new userActions.InitUser(user)))
    );
  }

  manageWS () {
    this.socketService.connect();
    this.socketService.auth(this.localStorage.getToken(false));
    this.socketService.messages$.pipe(
      map(message => JSON.parse(message)),
      filter((message: WebSocketPayload) => message.event === 'auth' && message.status === 'ok'),
      tap(() => this.socketService.retryingConnectWS = false)
    ).subscribe();
  }

}
