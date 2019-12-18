import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UrlService, ApiResources } from '@core/services';
import { OpportunityModel } from '../models/opportunity.model';
import {
  OpportunitiesSerializerService
} from '@applications/ecosystem/modules/opportunities/shared/services/opportunities-serializer.service';

@Injectable()
export class OpportunityDetailService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private sharedOpportunitiesService: OpportunitiesSerializerService
  ) {}

  getOpportunityDetail(pk: string): Observable<OpportunityModel> {
    const url = this.urlService.resolve(ApiResources.OPPORTUNITY_DETAIL, pk);
    return this.http.get(url)
      .pipe(map(
        (res) => this.sharedOpportunitiesService.serializeOpportunities(res)
      ));
  }

  applyOpportunity(pkOpportunity: number, dataToSend: any): Observable<OpportunityModel> {
    const url = this.urlService.resolve(ApiResources.APPLY_OPPORTUNITY, pkOpportunity.toString());
    return this.http.post(url, dataToSend).pipe(
      map((response) => this.sharedOpportunitiesService.serializeOpportunities(response))
      );
  }

  create(data: any): Observable<OpportunityModel> {
    const url = this.urlService.resolve(ApiResources.CREATE_OPPORTUNITY);
    return this.http.post(url, data).pipe(
      map(response => this.sharedOpportunitiesService.serializeOpportunities(response))
    );
  }

  preview(data: any): Observable<OpportunityModel> {
    const url = this.urlService.resolve(ApiResources.PREVIEW_OPPORTUNITY);
    return this.http.post(url, data).pipe(
      map(response => this.sharedOpportunitiesService.serializeOpportunities(response))
    );
  }

  edit(opportunityPk: number, data: any, queryParams?: any): Observable<any> {
    const url = this.urlService.resolve(ApiResources.OPPORTUNITY_DETAIL, opportunityPk.toString());
    return this.http.put(url, data, { params: queryParams }).pipe(
      map(response => this.sharedOpportunitiesService.serializeOpportunities(response))
    );
  }

  delete(pkOpportunity: number, comment: string, queryParams?: any): Observable<any> {
    const url = this.urlService.resolve(ApiResources.OPPORTUNITY_DETAIL, pkOpportunity.toString() );
    return this.http.request('delete', url, {body: {comment: comment}, params: queryParams});
  }
}
