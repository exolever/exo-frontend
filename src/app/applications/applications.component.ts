import { Component } from '@angular/core';

import { environment } from '@environments/environment';

const loadstatic = require('../../scripts/loadStatics');

@Component({
  selector: 'app-applications',
  template: `
    <app-message></app-message>
    <router-outlet versionChecker resolutionChecker></router-outlet>`
})
export class ApplicationsComponent {
  constructor() {
    loadstatic({production: environment.production});
  }
}
