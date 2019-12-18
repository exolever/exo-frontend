import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { UrlService, ApiResources } from '@core/services';

@Injectable()
export class ConsentService {

  constructor(private http: HttpClient, private urlService: UrlService) {}

  sendConsent( acceptConsent: boolean ): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.SEND_CONSENT);
    return this.http.post<any>( url, { 'value': acceptConsent } );
  }
}
