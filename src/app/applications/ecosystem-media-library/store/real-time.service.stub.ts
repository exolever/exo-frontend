
import { of as observableOf, Observable } from 'rxjs';

export class MediaLibraryWebsocketServiceStub {
  getUpdates(): Observable<any> {
    return observableOf(true);
  }
}
