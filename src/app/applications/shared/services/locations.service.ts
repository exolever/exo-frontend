import { Injectable, Inject } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

import { COUNTRIES } from '@core/services/countries-provider';


@Injectable()
export class LocationsService {
  constructor(@Inject(COUNTRIES) public countries: any) {}
  getCountries(): Observable<any> {
    return of (this.countries);
  }
}
