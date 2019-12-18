import {Observable, of as observableOf} from 'rxjs';
import {EventPermissionType} from '@ecosystem/modules/events/store/event.model';

export class EventsServiceStub {
  getPermissionsEvent(): Observable<EventPermissionType[]> {
    const data = [];
    data.push({
        category: 'WO',
        typeEventName: 'Exo Workshop'
      },
      {
        category: 'SU',
        typeEventName: 'Exo Summit'
      },
      {
        category: 'TA',
        typeEventName: 'Exo Talk'
      });
    return observableOf(data);
  }
}
