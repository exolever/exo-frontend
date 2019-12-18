import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { RedirectToService } from './redirect-to.service';
import { LocalStorageService } from '@app/core';

export interface GoToInterface {
  nextUrl: string;
  hardLink?: boolean;
}

@Injectable()
export class RedirectToGuard implements CanActivate {

  constructor(
    private router: Router,
    private redirectToService: RedirectToService,
    private localStorageService: LocalStorageService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<any> {
    const jwt = route.queryParams.token;
    if (jwt) {
      this.localStorageService.setToken(jwt);
    }

    if (this.localStorageService.getItem('token')) {
      return this.redirectToService.getNextUrl().pipe(
        map((data: GoToInterface) => {
          data.hardLink ? window.location.href = data.nextUrl : this.router.navigate([data.nextUrl]);
        })
      );
    }

    this.router.navigateByUrl('/auth/login');
    return of(true);
  }
}
