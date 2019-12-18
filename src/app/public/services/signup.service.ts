import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';

import {ApiResources, UrlService} from '@core/services';

@Injectable()
export class SignupService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
  ) {
  }

  getSignupInvitation(hash: string): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.BOARDING_INVITATION, hash);
    return this.http.get(url);
  }

  signup(email: string, password: string, hash: string) {
    const url = this.urlService.resolveAPI(ApiResources.SIGNUP, hash);
    return this.http.post(url, {email: email, password: password});
  }
}
