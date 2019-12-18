import { Injectable } from '@angular/core';
import { Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { map, filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { UserModel, Urls } from '@app/core';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import { StaticPermissions } from '@core/services/acl/permissions';
import * as userActions from '@core/store/user/user.action';

@Injectable()
export class MarketplaceAgreementGuard implements CanActivateChild {

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkPermissions(state.url);
  }

  private checkPermissions (nextUrl: string): Observable<boolean> {
    return this.store.pipe(
      select((state) => fromUser.getUser(state)),
      tap(user => {if (!user) { this.store.dispatch(new userActions.GetUser()); } }),
      filter(user => user !== undefined),
      map((user: UserModel) => {
        if (user.hasPermissionsSuperuserIncluded(StaticPermissions.CAN_ACCESS_MARKETPLACE)) {
          return true;
        } else {
          this.router.navigate([Urls.ECOSYSTEM_MARKETPLACE_CONDITIONS], { state: {nextUrl: nextUrl}});
          return false;
        }
      })
    );
  }
}
