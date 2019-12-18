import { Location, LocationStrategy, PlatformLocation } from '@angular/common';

export function locationFactory(strategy: LocationStrategy, platformLocation: PlatformLocation) {
  // reset hash for facebook
  if (window.location.hash === '#_=_') {
    window.location.hash = '';
  }
  return new Location(strategy, platformLocation);
}
