import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {IFilter, IFilterOption} from '@shared/components/filter/filter.component';
import {HttpClient} from '@angular/common/http';
import {ApiResources, UrlService} from '@app/core';


@Injectable()
export class FilterOptionsService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) {
  }

  initializeFilters(): Observable<IFilter[]> {
    let options: IFilterOption[] = [];
    const baseUrl = this.urlService.resolveAPI(ApiResources.ECOSYSTEM_FILTER);

    return this.http.get(baseUrl).pipe(
      map((resp: any) => {
        const f = <IFilter[]>[];
        resp.map(filter => {
          options = filter.items.map((item, i) => ({
            pk: item.value,
            name: item.name,
            selected: (!filter.multiselect && !i),
            showByDefault: item.default,
            optionsToUnmark: [filter.queryparam]
          }));
          f.unshift({
            name: filter.title,
            slug: filter.queryparam,
            options,
            isRadioButton: !filter.multiselect,
            dirty: false
          });
        });
        return <IFilter[]>f;
      }),
      catchError(error => of(error))
    );
  }
}
