import { Component } from '@angular/core';
const loadstatic = require('../../scripts/loadStatics');
import { environment } from '@environments/environment';

@Component({
  template: `
    <div class="exo-platform" fxFlexFill>
      <!-- top logotype bar -->
      <div fxLayoutAlign="start center" fxLayoutAlign.lt-sm="center center" class="top-bar" ngClass.gt-xs="pad-left-sm">
        <a href="https://www.openexo.com" target="_blank">
          <img src="/assets/public/openexo-logo-rgb.svg" width="240px" alt="">
        </a>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./public.scss']
})

export class PublicComponent {
  constructor() {
    loadstatic({isPublic: true, production: environment.production});
  }
}
