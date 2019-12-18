import { Injectable } from '@angular/core';

import { of as observableOf, Observable } from 'rxjs';

import { PaginationModel } from '@applications/shared/models/pagination.model';
import { Resource } from '../store/resource.model';


@Injectable()
export class ResourcesServiceStub {
  constructor(
  ) { }

  getResources(): Observable<PaginationModel<Resource>> {
    const resource = <Resource> { pk: '1', name: 'name' };
    return observableOf(
      new PaginationModel<Resource>(1, undefined, undefined, [resource])
    );
  }
  checkURL( url ): Observable<boolean> {
    return observableOf(true);
  }
}
