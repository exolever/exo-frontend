
import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { IFilter } from '@shared/components/filter/filter.component';
import { KeywordModel } from '@applications/shared/models';

@Injectable()
export class FilterOptionsServiceStub {

  constructor() { }

  getFilters(): Observable<IFilter[]> {
    const filters: IFilter[] = [];
    return  observableOf(filters);
  }

  getTags(): Observable<KeywordModel[]> {
    const tags: KeywordModel[] = [];
    return observableOf(tags);
  }
}
