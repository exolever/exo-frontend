import { Injectable } from '@angular/core';
import { DateLocale } from 'angular-md2';

@Injectable()
export class CustomDateLocale extends DateLocale {
  constructor() { super();
    this.firstDayOfWeek = 1;
  }
}

export const CUSTOM_DATE_LOCALE_PROVIDER = { provide: DateLocale, useClass: CustomDateLocale };
