import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from '@environments/environment';

const runtimeConfig = async() => {
  const localDomain = `${window.location.hostname}:8000`;
  const protocol = window.location.protocol;
  const localhost = 'localhost';

  return new Promise((resolve, reject) => {
    if (!environment) {
      reject();
    }

    if (environment.production && location.hostname !== localhost) {
      environment['baseUrl'] = '/';
      environment['websocketServerBaseUrl'] = `wss://${window.location.hostname}/ws/`;
      environment['websocketOpportunitiesUrl'] = `wss://${window.location.hostname}/opportunities/ws/`;
      environment['exoMediaLibraryBaseUrl'] = `/medialibrary/`;
      environment['exoEventsBaseUrl'] = `/events/`;
      environment['exoExQBaseUrl'] = `/exq/`;
      environment['exoPublicExQBaseUrl'] = `${protocol}//${window.location.hostname}/public-exq/`;
      environment['exoAuthBaseUrl'] = '/exo-auth/';
      environment['wsServerMediaLibraryBaseUrl'] = `wss://${window.location.hostname}/medialibrary/`;
      environment['exoWorkshopsLandingsBaseUrl'] = `/website/`;
      environment['exoJobsBaseUrl'] = `/jobs/`;
      environment['wsNotifications'] = `wss://${window.location.hostname}/notifications/ws/`;
    } else {
      // Dev mode.
      environment['baseUrl'] = `${protocol}//${localDomain}/`;
      environment['websocketServerBaseUrl'] = `ws://${localDomain}/ws/`;
      environment['websocketOpportunitiesUrl'] = `ws://${localDomain}/opportunities/ws/`;
      environment['exoMediaLibraryBaseUrl'] =  `${protocol}//${localDomain}/medialibrary/`;
      environment['exoAuthBaseUrl'] = `${protocol}//${localDomain}/exo-auth/`;
      environment['exoEventsBaseUrl'] =  `${protocol}//${localDomain}/events/`;
      environment['exoExQBaseUrl'] =  `${protocol}//${localDomain}/exq/`;
      environment['exoPublicExQBaseUrl'] =  `${protocol}//${localDomain}/public-exq/`;
      environment['wsServerMediaLibraryBaseUrl'] =  `ws://${localDomain}/medialibrary/`;
      environment['exoWorkshopsLandingsBaseUrl'] = `${protocol}//${localDomain}/website/`;
      environment['exoJobsBaseUrl'] = `${protocol}//${localDomain}/jobs/`;
      environment['wsNotifications'] = `ws://${localDomain}/notifications/`;
    }
    resolve();
  });
};

if (environment.production) {
  enableProdMode();
}

// Runtime configuration
runtimeConfig()
  .then(() => platformBrowserDynamic().bootstrapModule(AppModule));
