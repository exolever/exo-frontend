
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { UrlService, ApiResources } from '@core/services';
import { IFilterOption, IFilter } from '@shared/components/filter/filter.component';
import { KeywordModel } from '@applications/shared/models';

@Injectable()
export class FilterOptionsService {

  constructor(
    private authHttp: HttpClient,
    private urlService: UrlService,
    private translate: TranslateService
  ) { }

  getTags(): Observable<KeywordModel[]> {
    const url = this.urlService.resolveMediaLibrary(ApiResources.MEDIA_LIBRARY_TAGS);
    return this.authHttp.get<any>(url).pipe(
      catchError(error => of(error))
    );
  }

  getFilters(): Observable<IFilter[]> {
    const url = this.urlService.resolveMediaLibrary(ApiResources.MEDIA_LIBRARY_TAGS);
    return this.authHttp
      .get<any>(url).pipe(
        map( resp => {
          const filters = Array.from(new Set(resp.map(obj => obj['categorySlug']).filter(obj => obj !== null)));
          const data: IFilter[] = [];
          filters.forEach(filter => {
            const options = resp
                            .filter(item => item['categorySlug'] === filter)
                            .map(tag => {return <IFilterOption> {
                              name: tag.name,
                              pk: tag.slug,
                              selected: false,
                              showByDefault: tag.defaultShowFilter,
                              optionsToUnmark: [filter]
                            }; });
            options.unshift(<IFilterOption> {
              name: this.translate.instant('MEDIA.FILTERS.TAGS.ALL'),
              pk: filter,
              selected: true,
              showByDefault: true,
              optionsToUnmark: options.map(opt => opt.pk)
            });

            data.push(<IFilter>{
              name: filter,
              slug: filter,
              options: options,
              dirty: false
            });
          });
          return data;
        }),
        catchError(error => of(error))
      );
    }
}
