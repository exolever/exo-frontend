import { Injectable } from '@angular/core';

import { IntercomService } from '@core/services/intercom/intercom.service';

@Injectable()
export class IntercomServiceStub {
  constructor() {}

  bootIntercom( isBooted: boolean ): void {}

  shutdownIntercom(): void {}

  isIntercomBooted(): boolean { return false; }

  toggleIntercomWidget( isBooted: boolean ): void {}

  updateIntercomData( config: object ): void {}

  moveIntercomToAvoidOverlap( close: boolean, elementUnderMessengerHeight: number ) {}

  populateAppConfig( user: any ): void {}

}

export const IntercomServiceStubProvider = {
  provide: IntercomService,
  useClass: IntercomServiceStub
};
