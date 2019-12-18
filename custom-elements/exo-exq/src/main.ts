import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const runtimeConfig = async () => {
  const localDomain = `${window.location.hostname}:8000`;
  const protocol = window.location.protocol;
  const localhost = 'localhost';

  return new Promise((resolve, reject) => {
    if (!environment) {
      reject();
    }

    if (environment.production && location.hostname !== localhost) {
      environment['baseUrl'] = `${protocol}//${window.location.hostname}/`;
    } else {
      environment['baseUrl'] = `${protocol}//${localDomain}/`;
    }
    resolve();
  });
};

if (environment.production) {
  enableProdMode();
}

// Runtime configuration
runtimeConfig()
  .then(() => platformBrowserDynamic().bootstrapModule(AppModule))
  .catch(err => console.error(err));
