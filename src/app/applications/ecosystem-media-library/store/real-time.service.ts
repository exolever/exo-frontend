import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { share, map, retryWhen, delay, filter, switchMap } from 'rxjs/operators';
import makeWebSocketObservable, { GetWebSocketResponses } from 'rxjs-websockets';
import { QueueingSubject } from 'queueing-subject';

import { WebsocketChannel, UrlService } from '@core/services/api/resolve';
import { AppState } from 'core/store/reducers';
import * as CrudActions from './crud/crud.actions';
import { Resource } from './resource.model';

@Injectable()
export class MediaLibraryWebsocketService {
  messages: Observable<any>;

  constructor(
    private urlService: UrlService,
    private store: Store<AppState>,
  ) {
    this.messages = makeWebSocketObservable(
      this.urlService.resolveWebsocketMedialibrary(WebsocketChannel.MEDIA_LIBRARY)
    ).pipe(
      switchMap((getResponses: GetWebSocketResponses) => getResponses(new QueueingSubject<string>())),
      share()
    );
  }

  getUpdates(): Observable<any> {
    return this.messages.pipe(
      retryWhen(errors => errors.pipe(delay(1000))),
      map(m => JSON.parse(m)),
      filter(m => m['type'] === 'events'),
      map(m => this.store.dispatch(new CrudActions.UploadSuccessNotification(new Resource(m['payload']))))
    );
  }
}
