import { Injectable } from '@angular/core';

import { filter, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';

import { SocketService } from '@applications/sockets/service/socket.service';
import {
  WsSubscriptionsName, WebSocketPayload, WsObjectName, WsConversationActions, WsEvents
} from '@applications/sockets/config/config';

import * as QuestionsActions from '../store/action/questions.action';
import * as AnswersActions from '../store/action/answers.action';
import * as SessionsActions from '../store/action/sessions.action';

@Injectable()
export class SwarmWebsocketService {

  channelsToSubscribe = [
    WsSubscriptionsName.CONNECTED_USERS,
    WsSubscriptionsName.SWARM
  ];

  constructor(
    private socket: SocketService,
    private store: Store<AppState>
  ) { }

  getMessages() {
    this.channelsToSubscribe.forEach(channel => {
      this.socket.emit(WsEvents.SUBSCRIBE, channel);
      this.socket.addConnectedWs({name: channel});
    });

    this.socket.messages$.pipe(
      map(message => JSON.parse(message)),
      filter((message: WebSocketPayload) => this.channelsToSubscribe.includes(message.subscription) === true),
      tap(message => this.manageUpdate(message))
    ).subscribe();
  }

  closeWsChannels() {
    this.channelsToSubscribe.forEach(channel => {
      this.socket.emit(WsEvents.UNSUBSCRIBE, channel);
      this.socket.removeConnectedWs(channel);
    });
  }

  private manageUpdate(message: WebSocketPayload) {
    const objectName = message.data && message.data.object ? message.data.object : '';
    const actionName = message.data && message.data.action ? message.data.action : '';
    const data = message.data && message.data.payload ? message.data.payload : undefined;

    if (message.subscription === WsSubscriptionsName.SWARM) {
      this.manageSwarmsSubscriptions(objectName, actionName, data);
    }

    if (message.subscription === WsSubscriptionsName.CONNECTED_USERS) {
      this.manageUsersConnected(objectName, actionName, data);
    }
  }

  private manageSwarmsSubscriptions(objectName: string, actionName: string, data) {
    if (objectName === WsObjectName.POST) {
      this.store.dispatch(new QuestionsActions.EnableNotification(data));
    }

    if (objectName === WsObjectName.ANSWER) {
      switch (actionName) {
        case WsConversationActions.CREATE:
          this.store.dispatch(new AnswersActions.EnableNotification(data));
          this.store.dispatch(new QuestionsActions.EnableNotification(data));
          break;
        case WsConversationActions.DELETE:
          this.store.dispatch(new AnswersActions.EnableNotification(data));
          this.store.dispatch(new QuestionsActions.EnableNotification(data));
          break;
        case WsConversationActions.UPDATE:
          this.store.dispatch(new AnswersActions.UpdateAnswerSuccess(data));
          this.store.dispatch(new QuestionsActions.EnableNotification(data));
          break;
      }
    }
  }

  private manageUsersConnected(objectName: string, actionName: string, data) {
    switch (actionName) {
      case WsConversationActions.CONNECTED:
        this.store.dispatch(new SessionsActions.AddConnectedUsers(data.userUuid));
        break;
      case WsConversationActions.DISCONNECTED:
        this.store.dispatch(new SessionsActions.RemoveConnectedUsers(data.userUuid));
        break;
      default:
        break;
    }
  }
}
