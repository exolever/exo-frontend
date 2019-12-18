import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiResources, UrlService} from '@core/services';
import { ActivityModel } from '../models/activity.model';
import {
ActivitiesConfigurationService
} from '@applications/shared/services/activities-configuration.service';

@Injectable()
export class ActivitiesFormService {

  constructor(
    private urlService: UrlService,
    private authHttp: HttpClient,
    private profileActivitiesService: ActivitiesConfigurationService
  ) {
  }

  getActivities(): Observable<ActivityModel[]> {
    const baseUrl = this.urlService.resolveAPI(ApiResources.ACTIVITY_LIST);
    return this.authHttp.get<ActivityModel[]>(baseUrl).pipe(
      map(response => response.map(act => {
        const activity = act as ActivityModel;
        activity.icon = this.profileActivitiesService.getIcon(activity);
        return activity;
      })
    ));
  }
}

