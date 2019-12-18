import { of as observableOf, Observable } from 'rxjs';

import { ActivitiesConfigurationArray } from '@applications/shared/interfaces/activities-configuration.interface';
import { FakeActivityFactory } from '@applications/shared/faker_factories/activityFake.model';

export class ActivitiesFormServiceStub {
  getActivities(): Observable<any> {
    const data = [];
    ActivitiesConfigurationArray.map(act => {
      data.push(new FakeActivityFactory(act.code, act.code));
    });
    return observableOf(data);
  }

  saveData(pk: string, data: any): Observable<any> {
    return observableOf({
      exo_activities: ['advising']
    });
  }
}
