import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivate
} from '@angular/router';
import { UrlService, Urls } from '@app/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Error410EntityEnum } from '@core/services/interceptors/error-410.service';

import { CircleService } from './circle.service';

@Injectable()
export class CompatibilityGuard implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(private cs: CircleService, private router: Router, private urlService: UrlService) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    return this.cs.backwardCompatibility(next.params['slug']).pipe(
      tap(data => {
        if (data.isRemoved) {
          this.router.navigate(
            [Urls.ECOSYSTEM_ERROR_410],
            { skipLocationChange: true , queryParams: { entity: Error410EntityEnum.POST }},
          );
        } else {
          this.router.navigate(
            [this.urlService.getPath([Urls.ECOSYSTEM_CIRCLES_POST, data.circleSlug, data.postSlug])]
          );
        }
      }),
      map(() => false)
    );
  }
}
