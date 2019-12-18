import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResources, UrlService, } from '@core/services/api/resolve';


@Injectable()
export class ChangePasswordService {

    constructor(
      private authHttp: HttpClient,
      private urlService: UrlService
    ) {}

    changePassword( userPk: string, password: string ): Observable<any> {
      const url = this.urlService.resolveAPI( ApiResources.PROFILE_CHANGE_PASSWORD, userPk );
      const params = { 'new_password': password, 're_new_password': password };

      return this.authHttp.put( url, params );
    }
}
