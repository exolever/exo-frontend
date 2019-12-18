import { Injectable } from '@angular/core';

import { TrackingService } from './tracking.service';

@Injectable()
class TrackingServiceStubService {
  page() {}
  identify() {}
  track() {}
  trackVideo() {}
}

export const TrackingServiceStubProvider = {
  provide: TrackingService,
  useClass: TrackingServiceStubService
};
