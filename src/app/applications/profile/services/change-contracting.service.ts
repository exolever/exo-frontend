import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResources, UrlService, } from '@core/services/api/resolve';


@Injectable()
export class ChangeContractingService {

  constructor(
    private authHttp: HttpClient,
      private urlService: UrlService
    ) { }

    changeContracting(userPk: string, params: any): Observable<any> {
      const url = this.urlService.resolveAPI(ApiResources.PROFILE_CHANGE_CONTRACTING, userPk);
      return this.authHttp.put(url, params);
    }
}
