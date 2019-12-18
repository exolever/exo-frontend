import { Injectable } from '@angular/core';
import { OverlayConfig } from '@angular/cdk/overlay';

import { OverlayService } from './overlay.service';

interface Config extends OverlayConfig {
  data?: any;
}

export const MOCK_DEFAULT_OVERLAY_CONFIG: Config = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'full-screen-panel',
  width: '100%',
  height: '100%',
  data: {
    title: ''
  }
};


@Injectable()
export class OverlayServiceStub {
  open(): void {}
  close(): void {}
}

export const OverlayServiceStubProvider = { provide: OverlayService, useClass: OverlayServiceStub };
