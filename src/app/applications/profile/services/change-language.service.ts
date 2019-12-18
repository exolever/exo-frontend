import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResources, UrlService } from '@core/services/api/resolve';

@Injectable()
export class ChangeLanguageService {

  constructor(
    private authHttp: HttpClient,
      private urlService: UrlService
    ) { }

    changeLanguage(userPk: string, lang: string): Observable<any> {
      const url = this.urlService.resolveAPI(ApiResources.PROFILE_CHANGE_LANGUAGE, userPk);
      const params = {
        'platform_language': lang
      };
      return this.authHttp.put(url, params);
    }
}
