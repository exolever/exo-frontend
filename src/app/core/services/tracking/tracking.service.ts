import { Injectable } from '@angular/core';
import Player from '@vimeo/player';

import { environment } from '@environments/environment';
import { UserModel } from '@core/models';
import { Category, Event } from '@core/enums/analytics.enum';

@Injectable()
export class TrackingService {

    constructor() {
      analytics.load(environment.SEGMENT_KEY);
    }

    trackVideo(video: Element) {
      if (environment.production) {
        const player = new Player(video);
        const VimeoAnalytics = analytics.plugins.VimeoAnalytics;
        const vimeoAnalytics = new VimeoAnalytics(player, environment.VIMEO_KEY);
        vimeoAnalytics.initialize();
      } else {
        console.log('[SEGMENT] - trackVideo: ' + video);
      }
    }

    page(url: string) {
      if (environment.production) {
        analytics.page('Platform');
      } else {
        console.log('[SEGMENT] - page: ' + url);
      }
    }

    identify(user: UserModel) {
      if (environment.production) {
        analytics.identify(user.uuid, {
          name: user.fullName,
          email: user.email
        });
      } else {
        console.log('[SEGMENT] - identify: ' + JSON.stringify({
          name: user.fullName,
          uuid: user.uuid,
          email: user.email
        }));
      }
    }

    track(category: Category, event: Event, params?: any) {
      if (environment.production) {
        analytics.track(`${category} - ${event}`, {
          ...params,
          event: event,
          category: category
        });
      } else {
        console.log('[SEGMENT] - track: ' + `${category} - ${event}`, {
          ...params,
          event: event,
          category: category,
          params: params
        });
      }
    }
}
