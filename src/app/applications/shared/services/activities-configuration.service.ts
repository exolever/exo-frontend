import { Injectable } from '@angular/core';

import { ActivityModel } from '@applications/shared/models';

import {
  ActivitiesConfigurationArray,
  ActivityInterface
} from '@applications/shared/interfaces/activities-configuration.interface';

@Injectable()
export class ActivitiesConfigurationService {

  getActivityInterface( activity: ActivityModel ): ActivityInterface {
    return ActivitiesConfigurationArray.find( act => act.code === activity.code );
  }

  getIcon( activity: ActivityModel ): string {
    const result = this.getActivityInterface( activity );
    if ( result ) { return result.icon; }
    return 'developer_board';
  }

  getColor( activity: ActivityModel ): string {
    const result = this.getActivityInterface( activity );
    if ( result ) { return result.color; }
    return '#4dd0e1';
  }

}
