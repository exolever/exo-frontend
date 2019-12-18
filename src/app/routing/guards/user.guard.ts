import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { LocalStorageService, Urls, UrlService } from '@app/core';
import { IntercomService } from '@core/services/intercom/intercom.service';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';

@Injectable()
export class UserGuard implements CanActivate, CanActivateChild {
  isLoggedIntercom;
  constructor(
    private urlService: UrlService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private intercom: IntercomService,
    private store: Store<AppState>
  ) {}
  canActivate(route: ActivatedRouteSnapshot, routeState: RouterStateSnapshot): boolean {
    const isAuthorized = this.localStorageService.isAuthorized();
    this.store.pipe(select((state) => fromUser.getLoggedIntercom(state))).subscribe(
      isLogged => this.isLoggedIntercom = isLogged
    );
    const isIntercomBooted = this.intercom.isIntercomBooted();
    if (isAuthorized) {
      // boot intercom
      if ( !isIntercomBooted || !this.isLoggedIntercom) {this.intercom.bootIntercom(); }
      return true;
    } else {
      const url = this.urlService.getPath([Urls.LOGIN]);
      // shutdown intercom
      if ( isIntercomBooted ) { this.intercom.shutdownIntercom(); }
      isAuthorized ?
        this.router.navigate([url]) :
        this.router.navigate([url], { queryParams: { nextUrl: routeState.url }});
      return false;
    }
  }

  canActivateChild() {
    const isAuthorized = this.localStorageService.isAuthorized();
    if (!isAuthorized) {
      const url = this.urlService.getPath([Urls.LOGIN]);
      this.router.navigate([url]);
    }
    return isAuthorized;
  }
}
