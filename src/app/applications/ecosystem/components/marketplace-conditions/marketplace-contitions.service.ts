import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResources, UrlService } from '@core/services';
import { AgreementModel } from '@core/models/user/agreement.model';

@Injectable()
export class MarketPlaceService {

  constructor(
    private urlService: UrlService,
    private authHttp: HttpClient
  ) {}

  getMarketPlaceConditions(): Observable<AgreementModel> {
    const url = this.urlService.resolveAPI(ApiResources.GET_MARKETPLACE_AGREEMENT);
    return this.authHttp.get<AgreementModel[]>(url).pipe(
      map(response => new AgreementModel(response[0]))
    );
  }

  acceptAgreement (pkAgreement: number) {
    const url = this.urlService.resolveAPI(ApiResources.ACCEPT_MARKETPLACE_AGREEMENT, pkAgreement);
    return this.authHttp.post(url, {});
  }
}
