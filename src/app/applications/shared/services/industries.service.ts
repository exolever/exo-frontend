import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { ApiResources, UrlService } from '@core/services';
import { IndustryModel } from '@applications/shared/models/industry.model';

@Injectable()
export class IndustriesService {

  constructor(
    private authHttp: HttpClient,
    private urlService: UrlService
  ) { }

  getIndustries(): Observable<IndustryModel[]> {
    const url = this.urlService.resolveAPI(ApiResources.INDUSTRIES_LIST);
    return this.authHttp.get<Object[]>(url).pipe(map(resp => {
      return this.parseIndustries(resp);
    }));
  }

  parseIndustries(industries: Array<any>): Array<IndustryModel> {
    return industries.map(industry => {
      return new IndustryModel(industry.name, industry.id);
    });
  }
}




