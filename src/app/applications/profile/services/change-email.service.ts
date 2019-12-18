import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResources, UrlService, } from '@core/services/api/resolve';


@Injectable()
export class ChangeEmailService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  checkEmail(newEmail: string, userPk: number): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.CHECK_EMAIL);
    const data = {
      'user': userPk,
      'email': newEmail
    };
    return this.http.post(url, data);
  }

  changeEmail(newEmail: string, userPk: number): Observable<any> {
    const url = this.urlService.resolveAPI(
      ApiResources.PROFILE_CHANGE_EMAIL,
      userPk.toString());
    const data = {
      'email': newEmail
    };
    return this.http.put(url, data);
  }
}
