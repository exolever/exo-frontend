import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {InvitationActionEnum, InvitationEnum} from '@shared/enums/invitation.enum';
import {ApiResources, UrlService} from '@core/services';


@Injectable()
export class InvitationService {

  constructor(
    private authHttp: HttpClient,
    private urlService: UrlService,
  ) {}

  getInvitation(hash: string, type: InvitationEnum): Observable<any> {
    const url = this.urlService.resolveAPI(ApiResources.BOARDING_INVITATION, hash);
    return this.authHttp.get(url);
  }

  sendAction(action: InvitationActionEnum, hashInvitation: string, data: any = {}): Observable<any> | undefined {
    let url;
    switch (action) {
      case InvitationActionEnum.ACCEPT:
        url = this.urlService.resolveAPI(ApiResources.ACCEPT_INVITATION, hashInvitation);
        break;
      case InvitationActionEnum.DECLINE:
        url = this.urlService.resolveAPI(ApiResources.DECLINE_INVITATION, hashInvitation);
        break;
    }
    if (url) {
      return this.authHttp.post(url, data);
    }
  }
}
