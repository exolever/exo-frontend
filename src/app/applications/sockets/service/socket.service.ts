import { Injectable } from '@angular/core';

import { switchMap, share, retryWhen, delay, tap } from 'rxjs/operators';
import { Observable, } from 'rxjs';
import { QueueingSubject } from 'queueing-subject';
import makeWebSocketObservable, { GetWebSocketResponses } from 'rxjs-websockets';

import { UrlService } from '@app/core/services/api/resolve/urls';
import { LocalStorageService } from '@core/services/localStorage.service';
import { WsEvents, ConnectedWSInterface } from '@applications/sockets/config/config';

import { WsSubscriptionsName } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  queueing$ = new QueueingSubject<any>();
  messages$: Observable<any>;
  retryingConnectWS = false;
  private connectedWS: ConnectedWSInterface[] = [];

  constructor(
    private urlService: UrlService,
    private localStorage: LocalStorageService
  ) { }

  connect(): void {
    const url = this.urlService.resolveWsNotifications();
    this.messages$ = makeWebSocketObservable(url).pipe(
      switchMap((getResponses: GetWebSocketResponses) => getResponses(this.queueing$)),
      retryWhen(errors => errors.pipe(
        delay(30000),
        tap(() => {
          if (!this.retryingConnectWS) {
            this.reconnect();
          }
        })
      )),
      share(),
      );
  }

  emit(event: string, subscription?: WsSubscriptionsName, data?: any[]): void {
    this.queueing$.next(JSON.stringify({
      event: event,
      subscription: subscription,
      data
    }));
  }

  auth(bearer: string): void {
    const obj = { event: 'auth', method: 'ticket', 'ticket': bearer };
    this.queueing$.next(JSON.stringify(obj));
  }

  addConnectedWs(ws: ConnectedWSInterface) {
    this.connectedWS.push(ws);
  }

  removeConnectedWs(name: string) {
    const indexWSFound = this.connectedWS.findIndex((ws) => ws.name === name);
    if (indexWSFound > 0) {
      this.connectedWS = this.connectedWS.slice(0, indexWSFound);
    }
  }

  private reconnect() {
    this.auth(this.localStorage.getToken(false));
    this.retryingConnectWS = true;
    this.connectedWS.forEach(channel => {
      channel.parameters ?
        this.emit(WsEvents.SUBSCRIBE, channel.name, [channel.parameters]) :
        this.emit(WsEvents.SUBSCRIBE, channel.name);
    });
  }

}
