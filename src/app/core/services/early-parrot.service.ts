import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResources, UrlService } from '@app/core';
import { Observable } from 'rxjs';
import { Campaign } from '@applications/early-parrot/model/campaign.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class EarlyParrotService {

  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService,
    private cookieService: CookieService,
  ) { }

  getCampaigns(): Observable<Campaign[]> {
    const url = this.urlService.resolveAPI(ApiResources.GET_CAMPAIGNS);
    return this.httpClient.get<Campaign[]>(url);
  }

  createSubscribe(isConversion = false) {
    const rh = this.cookieService.get('rh');
    const campaignId = this.cookieService.get('campaignId');
    const url = this.urlService.resolveAPI(ApiResources.SUBSCRIBE_CAMPAIGNS, campaignId);
    return this.httpClient.post(
      url,
      { 'rh': rh, 'conversion': isConversion }
      );
  }

}
