// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { environment } from '@environments/environment';

const testConfig = () => {
  const localDomain = `localhost:8000`;
  const protocol = 'http:';
  environment['baseUrl'] = `${protocol}//${localDomain}/`;
  environment['exoCalendarBaseUrl'] = `${protocol}//${localDomain}/calendar/`;
  environment['websocketServerBaseUrl'] = `ws://${localDomain}/ws/`;
  environment['exoMediaLibraryBaseUrl'] =  `${protocol}//${localDomain}/medialibrary/`;
  environment['exoEventsBaseUrl'] =  `${protocol}//${localDomain}/events/`;
  environment['exoExQBaseUrl'] =  `${protocol}//${localDomain}/exq/`;
  environment['wsServerMediaLibraryBaseUrl'] =  `ws://${localDomain}/medialibrary/`;
  environment['exoWorkshopsLandingsBaseUrl'] = `${protocol}//${localDomain}/website/`;
};

testConfig();

declare var require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);

// And load the modules.
context.keys().map(context);
