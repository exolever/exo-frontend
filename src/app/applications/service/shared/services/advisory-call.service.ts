import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { UrlService, ApiResources } from '@core/services';


@Injectable()
export class AdvisoryCallService {
  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  getAdvisoryCallSettings(groupUuid: string): Observable<any> {
    const apiUrl = this.urlService.resolve(ApiResources.GET_ADVISORY_CALL_SETTINGS_PROJECT, groupUuid);
    return this.http.get<any>(apiUrl);
  }
}
