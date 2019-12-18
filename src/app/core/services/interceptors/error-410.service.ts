import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { Urls } from '@core/services/navigate';

export enum Error410EntityEnum {
  OPPORTUNITY = 'Opportunity',
  POST = 'Post',
  CIRCLE = 'Circle',
  GENERIC = 'Generic'
}

@Injectable({
  providedIn: 'root'
})
export class Error410Service {

  constructor(
    private router: Router
  ) { }

  navigate(error: any): void {
    const entity = error.error ? error.error.classname : undefined;
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true,
      state: { entity: entity ? entity : Error410EntityEnum.GENERIC}
    };
    this.router.navigate([Urls.ECOSYSTEM_ERROR_410], navigationExtras);
  }
}
