import { Injectable } from '@angular/core';

import { Observable, EMPTY } from 'rxjs';

import { ServiceInformationService } from '@applications/service/old-project/services/service-info.service';

@Injectable()
class ServiceInformationStubService {
  getStep( pk?: string ): Observable<any> { return EMPTY; }
  markTaskAsDone(...params: Array<any>) { return EMPTY; }
  markTaskAsTodo(...params: Array<any>) { return EMPTY; }
  uploadDeliverable(...params: Array<any>) { return EMPTY; }
  sendFeedback(...params: Array<any>) { return EMPTY; }
}

/**
 * Pre-configured provider for ServiceInformationStubService
 */
export const ServiceInformationStubServiceProvider = {
  provide: ServiceInformationService,
  useClass: ServiceInformationStubService
};
