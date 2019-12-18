import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { UrlService, ApiResources } from '@core/services/api/resolve';

@Injectable()
export class RedirectToService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) {}

  getNextUrl(): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.GO_TO);
    return this.http.get<{nextUrl: string}>(url);
  }
}
