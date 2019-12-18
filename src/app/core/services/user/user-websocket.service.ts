import { Injectable } from '@angular/core';

import { filter, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '@core/store/reducers';
import * as userActions from '@core/store/user/user.action';
import { SocketService } from '@applications/sockets/service/socket.service';
import {
  WsSubscriptionsName, WebSocketPayload, WsUserActions, WsEvents
} from '@applications/sockets/config/config';

import { UserModel } from '../../models/user/user.model';

@Injectable()
export class UserWebsocketService {

  constructor(
    private socket: SocketService,
    private store: Store<AppState>,
  ) { }

  subscribe() {
    this.socket.emit(WsEvents.SUBSCRIBE, WsSubscriptionsName.USER);
    this.socket.addConnectedWs({name: WsSubscriptionsName.USER});
  }

  getMessages(): Observable<any> {
    return this.socket.messages$.pipe(
      map(message => JSON.parse(message)),
      filter((message: WebSocketPayload) => message.subscription === WsSubscriptionsName.USER),
      tap(message => this.manageUpdate(message))
    );
  }

  private manageUpdate(message: WebSocketPayload) {
    const objectName = message.data && message.data.object ? message.data.object : '';
    const actionName = message.data && message.data.action ? message.data.action : '';
    const data = message.data && message.data.payload ? message.data.payload : undefined;
    this.manageUserSubscriptions(objectName, actionName, data);
  }

  private manageUserSubscriptions(objectName: string, actionName: string, data) {
    switch (actionName) {
      case WsUserActions.UPDATE:
        this.store.dispatch(new userActions.UpdateUser(new UserModel(data)));
        break;
      default:
        break;
    }
  }
}
