import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { socialNetworkType } from '@applications/shared/models';
import { getValueEnum } from '@shared/helpers/enum.helper';

import { UrlService, ApiResources } from '../../core/services/api/resolve';
import { Urls } from '@app/core';

@Injectable()
export class LoginService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
  ) {}

  login( username: string, password: string ): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.LOGIN);

    return this.http.post<any>( url, { 'username': username, 'password': password } );
  }

  loginSocialNetwork( socialNetwork: socialNetworkType, uuid?: string ): string {
    let url: string;

    switch (socialNetwork) {
      case socialNetworkType.linkedin || socialNetworkType.linkedin.toString():
        url = this.urlService.resolve(Urls.LOGIN_LINKEDIN);
        break;
      case socialNetworkType.facebook || socialNetworkType.facebook.toString():
        url = this.urlService.resolve(Urls.LOGIN_FACEBOOK);
        break;
      case socialNetworkType.twitter || socialNetworkType.twitter.toString():
        url = this.urlService.resolve(Urls.LOGIN_TWITTER);
        break;
      case socialNetworkType.medium || socialNetworkType.medium.toString():
        url = this.urlService.resolve(Urls.LOGIN_MEDIUM);
        break;
    }
    if (uuid) {
      url = this.urlService.resolveGetParams(url, ['user_id'], [uuid]);
    }

    return url;
  }

  disconnectSocialNetwork( socialNetwork: socialNetworkType ): Observable<any> {
    let url: string;

    if (socialNetworkType.linkedin || socialNetworkType.linkedin.toString()) {
      url = this.urlService.resolveAPI(ApiResources.DISCONNECT_LINKEDIN);
    } else {
      const backendName = getValueEnum(socialNetworkType, socialNetwork);
      url = this.urlService.resolveAPI(ApiResources.DISCONNECT, backendName);
    }

    return this.http.post<any>(url, {});
  }
}
