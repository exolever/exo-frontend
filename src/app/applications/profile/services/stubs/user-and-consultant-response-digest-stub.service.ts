import { Injectable } from '@angular/core';

import { UserAndConsultantResponseDigestService } from '../user-and-consultant-response-digest.service';

@Injectable()
class UserAndConsultantResponseDigestStubService {

  digestResponseAndBuildUserApplicationData(...params: Array<any>): any {
    return {};
  }

  digestAndBuildConsultantDataFromProgileRequestResponse(...params: Array<any>): any {
    return {};
  }

}

export const userAndConsultantResponseDigestStubServiceProvider = {
  provide: UserAndConsultantResponseDigestService,
  useClass: UserAndConsultantResponseDigestStubService
};
