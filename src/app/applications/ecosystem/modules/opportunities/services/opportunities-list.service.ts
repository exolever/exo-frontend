import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiResources, UrlService } from '@core/services';
import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';
import {
  OpportunitiesSerializerService
} from '@applications/ecosystem/modules/opportunities/shared/services/opportunities-serializer.service';
import { Pagination } from '@core/interfaces/pagination.interface';

@Injectable()
export class OpportunitiesListService {

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
    private opportunitiesSerializerService: OpportunitiesSerializerService
  ) {}

  private getOpportunitiesList(
    url: string,
    params: { searchBy: string; pageIndex: number; pageSize: number, isPublishedByYou?: boolean }
  ): Observable<Pagination<OpportunityModel>> {
    const paramKeys = ['search', 'page', 'page_size'];
    const paramValues = [
      params.searchBy, params.searchBy ? 1 : params.pageIndex.toString(), params.pageSize.toString()
    ];
    if (params.isPublishedByYou) {
      paramKeys.push('published_by_you');
      paramValues.push('True');
    }
    url = this.urlService.resolveGetParams(url, paramKeys, paramValues);
    return this.httpClient.get<Pagination<OpportunityModel>>(url)
      .pipe(
        tap((response: Pagination<OpportunityModel>) =>
          (response.results = response.results.map(
            opportunity => this.opportunitiesSerializerService.serializeOpportunities(opportunity)))
        )
      );
  }

  getOpportunities(
    params: { searchBy: string; pageIndex: number; pageSize: number, isPublishedByYou?: boolean },
  ): Observable<Pagination<OpportunityModel>> {
    const url = this.urlService.resolve(ApiResources.OPPORTUNITIES_LIST);
    return this.getOpportunitiesList(url, params);
  }

  getAdvisoryCalls(
    params: { groupPk: number, searchBy: string; pageIndex: number; pageSize: number, isPublishedByYou?: boolean },
  ): Observable<Pagination<OpportunityModel>> {
    const url = this.urlService.resolve(ApiResources.GET_ADVISORY_CALLS, params.groupPk.toString());
    return this.getOpportunitiesList(url, params);
  }

}
