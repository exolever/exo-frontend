
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Circle } from '../models/circle.model';
import { CircleService } from './circle.service';
import { Observable } from 'rxjs';

@Injectable()
export class JoinResolver implements Resolve<Circle> {
  constructor(
    private circleService: CircleService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.circleService.join(route.params.circleSlug);
  }
}
