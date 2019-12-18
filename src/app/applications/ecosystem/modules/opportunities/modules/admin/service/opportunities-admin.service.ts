import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources, UrlService } from '@app/core';
import {
  OpportunitiesSerializerService
} from '@applications/ecosystem/modules/opportunities/shared/services/opportunities-serializer.service';
import {
  SowDeserializerService
} from '@applications/ecosystem/modules/opportunities/shared/services/sow-deserializer.service';
import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';
import { RolesService } from '@core/modules/roles/services/roles.service';

import { OpportunityApplicantModel } from '../../../models/opportunity-applicant.model';


@Injectable({
  providedIn: 'root'
})
export class OpportunitiesAdminService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private opportunitySharedService: OpportunitiesSerializerService,
    private sowDeserializerService: SowDeserializerService,
    private rolesService: RolesService
  ) { }


  getOpportunityDetailAdmin(pk: string): Observable<OpportunityModel> {
    const url = this.urlService.resolve(ApiResources.OPPORTUNITY_DETAIL_ADMIN, pk);
    return this.http.get(url)
      .pipe(map(
        (res) => this.opportunitySharedService.serializeOpportunities(res)
      ));
  }

  selectApplicant(applicant: OpportunityApplicantModel, sow: any, message: string) {
    const url = this.urlService.resolve(ApiResources.ASSIGN_APPLICANT, applicant.pk.toString());
    return this.http.put(url, { sow: sow, responseMessage: message})
      .pipe(
        map((res: any) => this.opportunitySharedService.serializeOpportunities(res))
    );
  }

  rejectApplicant(applicantPk: number, message: string) {
    const url = this.urlService.resolve(ApiResources.REJECT_APPLICANT, applicantPk.toString());
    return this.http.put(url, { responseMessage: message})
      .pipe(
        map((res: any) => this.opportunitySharedService.serializeOpportunities(res))
    );
  }

  closeOpportunity(opportunityPk: number, message?: string, queryParams?: any) {
    const url = this.urlService.resolve(ApiResources.CLOSE_OPPORTUNITY, opportunityPk.toString());
    let data: {[key: string]: any} = {};
    message ? data.comment = message : data = {};
    return this.http.put(url, data, { params: queryParams })
      .pipe(
        map((res: any) => this.opportunitySharedService.serializeOpportunities(res))
      );
  }

  reopenOpportunity(opportunityPk: number, deadline: string, queryParams?: any) {
    const url = this.urlService.resolve(ApiResources.REOPEN_OPPORTUNITY, opportunityPk.toString());
    const data: {[key: string]: any} = {};
    data.deadline_date = deadline;
    return this.http.put(url, data, { params: queryParams })
      .pipe(
        map((res: any) => this.opportunitySharedService.serializeOpportunities(res))
      );
  }

  editSow(applicant: OpportunityApplicantModel, sow: any, message: string): Observable<OpportunityModel> {
    const url = this.urlService.resolve(ApiResources.GET_DATA_SOW, applicant.pk.toString());
    return this.http.put(url, { sow: sow, responseMessage: message})
      .pipe(
        map((res: any) => this.opportunitySharedService.serializeOpportunities(res))
    );
  }

  getDataInitSow(applicantPk: number): Observable<any> {
    const url = this.urlService.resolve(ApiResources.GET_DATA_INITIALIZE_SOW, applicantPk.toString());
    return this.http.get(url)
      .pipe(map((res) => this.sowDeserializerService.deserialize(res)));
  }

  getRoles(): Observable<any> {
    const url = this.urlService.resolve(ApiResources.GET_ROLES);
    return this.http.get(url)
      .pipe(map((res) => this.rolesService.deserialize(res)));
  }
}
