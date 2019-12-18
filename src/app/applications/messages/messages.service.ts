
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { ApiResources, UrlService } from '@core/services/api/resolve';
import { AlertMessageResponseInterface } from '@applications/shared/interfaces/alert-message-response.interface';

import { PersistentMessageActionEnum } from './enums';
import { PersistentMessageModel } from './models/persistent-message.model';
@Injectable()
export class MessageService {

  private messagesList$: Subject<boolean>;

  constructor( private urlService: UrlService, private authHttp: HttpClient ) {
    this.messagesList$ = new Subject();
  }

  getMessages(): Observable<Array<PersistentMessageModel>> {
    const url = this.urlService.resolveAPI( ApiResources.PERSISTENT_MESSAGES_LIST );
    return this.authHttp.get( url ).pipe(map( (resp: AlertMessageResponseInterface[]) => this.setMessages( resp ) ));
  }

  setMessages( messages: Array<AlertMessageResponseInterface> ): Array<PersistentMessageModel> {
    return messages ? messages.map( msg => {
      // create the message model with the message data
      const msgModel = new PersistentMessageModel( msg.id, msg.level, msg.code );
      msgModel.canBeClosed = msg.can_be_closed;
      msgModel.variables = msg.variables;

      return msgModel;
    }) : [];
  }

  setMessagesList$(): void {
    this.messagesList$.next(true);
  }

  getMessagesList$(): Observable<boolean> {
    return this.messagesList$.asObservable();
  }

  sendAction( action: string, msg: PersistentMessageModel ): Observable<Object> | undefined {
    const data = {};
    let url;
    switch ( action ) {
      case PersistentMessageActionEnum.RESEND_VERIFICATION_EMAIL:
        url = this.urlService.resolveAPI( ApiResources.RESEND_VERIFICATION_EMAIL );
        data[ 'user' ] = msg.getValueForVariable( 'user_pk' );
        data[ 'email' ] = msg.getValueForVariable( 'email' );
        break;
      case PersistentMessageActionEnum.DISCARD_PENDING_EMAIL:
        url = this.urlService.resolveAPI( ApiResources.DISCARD_PENDING_EMAIL );
        data[ 'verif_key' ] = msg.getValueForVariable( 'verif_key' );
        data[ 'email' ] = msg.getValueForVariable( 'pk' );
        break;
      case PersistentMessageActionEnum.CLOSE_PERSISTENT_MESSAGE:
        url = this.urlService.resolveAPI( ApiResources.CLOSE_PERSISTENT_MESSAGE, msg.pk );
        break;
    }

    return url ? this.authHttp.post( url, data ) : undefined;
  }
}
