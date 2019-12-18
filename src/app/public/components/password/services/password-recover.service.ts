import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResources, UrlService, } from '@core/services/api/resolve';


@Injectable()
export class PasswordRecoverService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService) { }

  requestPassword(email: string): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.ENDPOINT_PASSWORD_REQUEST);
    return this.http.post(url, { 'email': email });
  }

  changePassword(token: string, password1: string, password2: string): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.ENDPOINT_PASSWORD_CHANGE);
    const params = {
      'token': token,
      'new_password1': password1,
      'new_password2': password2
    };

    return this.http.post(url, params);
  }
}
