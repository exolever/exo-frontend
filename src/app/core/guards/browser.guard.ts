import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

import { WindowRef } from '@core/services/browser-api/window-ref.service';

import { UrlService } from '../services/api/resolve/urls';
import { Urls } from '../services/navigate/urls';

@Injectable()
export class BrowserGuard implements CanActivateChild {
  constraints: Array<string> = ['flexbox'];
  supported: boolean;
  modernizr = this.window.nativeWindow.Modernizr;

  constructor( private urlService: UrlService, private router: Router, private window: WindowRef ) {}

  canActivateChild(): boolean {
    // check if all properties defined in this.constraints are supported
    this.supported = this.constraints.every( constraint => {
      if ( this.modernizr.hasOwnProperty( constraint ) ) {
        return this.modernizr[ constraint ];
      }
    });

    if ( !this.supported ) {
      const url = this.urlService.getPath( [Urls.BROWSER_NOT_SUPPORTED] );
      this.router.navigate([ url ]);
    }

    return this.supported;
  }
}
