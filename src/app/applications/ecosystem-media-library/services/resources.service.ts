import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as MomentTZ from 'moment-timezone';

import { AppState } from '@core/store/reducers';
import { UrlService, ApiResources } from '@core/services';
import { PaginationModel } from '@applications/shared/models/pagination.model';
import { KeywordModel } from '@applications/shared/models/keyword.model';
import { OrderEnum } from '@applications/shared/enums';

import { Resource } from '../store/resource.model';
import { LIBRARY_CONFIG } from '../ecosystem-media-library.conf';
import * as fromMediaLibrary from '../store/reducers';

@Injectable()
export class ResourcesService {

  constructor(
    private store: Store<AppState>,
    private authHttp: HttpClient,
    private urlService: UrlService,
    @Inject(LIBRARY_CONFIG) private mediaConfig
  ) {}

  getResources(): Observable<PaginationModel<Resource>> {
    let paramsWithEndpoint: {params: any, endpoint: string};
    let url: string;

    /*
     *  TODO: fix this synchronous flow that receives data from an asynchronous one. Problems arise when trying to
     *  wrap it on an observable pipe
     */
    this.store.pipe(select(state => fromMediaLibrary.selectQueryParams(state)))
      .subscribe(state => paramsWithEndpoint = this.setParamsForRequestAndDetermineEndPoint(state));

    const keys = Object.keys(paramsWithEndpoint.params).filter(
      key => paramsWithEndpoint.params[key] !== undefined
    );
    const values = keys.map(key => paramsWithEndpoint.params[key]);
    url = this.urlService.resolveGetParams(paramsWithEndpoint.endpoint, keys, values);

    return this.authHttp.get<PaginationModel<Resource>>(url).pipe(
      map(resp => {
        const resources = resp.results.map(r =>
          new Resource({
            pk: r.pk,
            name: r.name,
            iframe: r.iframe,
            description: r.description,
            duration: +r.duration,
            link: r.link,
            created: MomentTZ(r['modifiedTime']),
            tags: r.tags.map(tag => {
              const keyword = new KeywordModel(tag['name']);
              keyword.pk = tag['pk'];
              return keyword;
            }),
            status: r.status,
            thumbnail: r.thumbnail,
            type: r.type,
            sections: r.sections
          }));
        return new PaginationModel<Resource>(resp.count, resp.next, resp.previous, resources);
      })
    );

  }

  checkURL(dataURL): Observable<{} | boolean> {
    const url = this.urlService.resolveMediaLibrary(ApiResources.MEDIA_VALIDATE_URL);
    const params = {
      url: dataURL
    };
    return this.authHttp.post<boolean>(url, params).pipe(
      map(resp => resp),
      catchError(response => response.error)
    );
  }

  upload(data): Observable<Resource> {
    const url = this.urlService.resolveMediaLibrary(ApiResources.MEDIA_LIBRARY_UPLOAD);
    return this.authHttp.post<Resource>(url, data).pipe(
      map(resp => new Resource(resp))
    );
  }

  update(data): Observable<Resource> {
    const url = this.urlService.resolveMediaLibrary(ApiResources.MEDIA_LIBRARY_UPDATE, data.pk);
    return this.authHttp.put<Resource>(url, data).pipe(
      map(resp => new Resource(resp))
    );
  }

  delete(resource: Resource): Observable<Resource> {
    const url = this.urlService.resolveMediaLibrary(ApiResources.MEDIA_LIBRARY_DELETE, resource.pk);
    return this.authHttp.delete<Resource>(url).pipe(
      map(resp => new Resource(resp))
    );
  }

  /**
   * Returns the appropriate string to for the order selector in the media library context
   * @param state
   * @returns {string}
   */
  getOrderingCharacter(state: any): string {
    if (state.order === OrderEnum.Desc) {
      return '';
    } else if (state.order === OrderEnum.Asc) {
      return '-';
    } else {
      return this.mediaConfig.defaultOrder[state.sortBy] === OrderEnum.Asc ? '-' : '';
    }
  }

  /**
   * returns the params necessary with the endpoint to use
   * @param state: the store state
   * @returns response: {params: any, endpoint: string}
   */
  setParamsForRequestAndDetermineEndPoint(state: any): {params: any, endpoint: string} {
    const pkFilters = state.filters
      .filter(filter => filter.name !== 'status')
      .map(filter => filter.options.filter(opt => opt.selected).map(opt => opt.pk));

    // The option All has the same pk the name of the filter
    const allOptions = state.filters.map(f => f.name);
    // When All option is selected don't send any to backend
    const selectedFilters = pkFilters.map(f => f.some(selectedOpt => allOptions.includes(selectedOpt)) ? [] : f);

    const filters = [].concat(...selectedFilters);
    const statuses = state.filters
      .filter(f => f.name === 'status')
      .map(f => f.options.filter(opt => opt.selected === true && opt.pk !== 'status').map(opt => opt.pk));
    const characterToOrder = this.getOrderingCharacter(state);
    const params = {
      page: state.page,
      page_size: state.pageSize,
      tags: filters,
      search: state.searchTerms,
      ordering: characterToOrder.concat(state.sortBy),
      status: statuses
    };

    if (state.projectsUUID) {
      params['projects'] = state.projectsUUID;
      return {
        params: params,
        endpoint: this.urlService.resolveMediaLibrary(ApiResources.MEDIA_LIBRARY_PROJECT)
      };
    } else {
      params['sections'] = state.sections;
      return {
        params: params,
        endpoint: this.urlService.resolveMediaLibrary(ApiResources.MEDIA_LIBRARY_SEARCH)
      };
    }
  }

}
