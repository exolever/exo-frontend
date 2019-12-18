import { InjectionToken } from '@angular/core';

export enum Areas {
  ecosystem,
  platform
}

export const AREAS = new InjectionToken<Areas>('Areas');

export const AreasProvider = { provide: AREAS, useValue: Areas };
