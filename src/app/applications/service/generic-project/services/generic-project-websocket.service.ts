import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WebSocketPayload, WsProjectActions } from '@applications/sockets/config/config';
import { WsSubscriptionsName, WsEvents, WsProjectObjects } from '@applications/sockets/config/config';
import { SocketService } from '@applications/sockets/service/socket.service';
import { AppState } from '@core/store/reducers';
import { Quiz } from '@applications/service/shared/models';

import * as StepActions from '../store/actions/steps.actions';


@Injectable()
export class GenericProjectWebsocketService {
  messages: Observable<any>;

  constructor(
    private socket: SocketService,
    private store: Store<AppState>,
  ) { }

  subscribe(projectPk) {
    this.socket.emit(WsEvents.SUBSCRIBE, WsSubscriptionsName.GENERIC_PROJECT, [projectPk]);
    this.socket.addConnectedWs({name: WsSubscriptionsName.GENERIC_PROJECT, parameters: projectPk});
  }

  getMessages() {
    return this.socket.messages$.pipe(
      map(message => JSON.parse(message)),
      filter((message: WebSocketPayload) => message.subscription === WsSubscriptionsName.GENERIC_PROJECT),
      tap(message => this.manageUpdate(message))
    );
  }

  private manageUpdate(message: WebSocketPayload) {
    const objectName = message.data && message.data.object ? message.data.object : '';
    const actionName = message.data && message.data.action ? message.data.action : '';
    const data = message.data && message.data.payload ? message.data.payload : undefined;
    this.manageProjectSubscriptions(objectName, actionName, data);
  }

  private manageProjectSubscriptions(objectName: string, actionName: string, data) {
    switch (objectName) {
      case WsProjectObjects.MICROLEARNING_AVERAGE:
        if (WsProjectActions.UPDATE === actionName) {
          const payload = { quiz: new Quiz(data.object), stepPk: data.stepPk };
          this.store.dispatch(new StepActions.UpdateGProjectQuizRatings(payload));
        }
        break;
      case WsProjectObjects.USER_TYPEFORM_FEEDBACK:
        if (WsProjectActions.CREATE === actionName) {
          // TODO: For now, this event is not managed by the frontend side
        } else if (WsProjectActions.UPDATE === actionName) {
          // TODO: For now, this event is not managed by the frontend side
        }
        break;
      default:
        break;
    }
  }
}
