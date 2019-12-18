import { NgModule } from '@angular/core';

import { Md2DatepickerModule, MdNativeDateModule } from 'angular-md2';

import { CUSTOM_DATE_LOCALE_PROVIDER } from '@shared/md2/date-locale-custom-provider';

@NgModule({
  imports: [Md2DatepickerModule, MdNativeDateModule],
  exports: [Md2DatepickerModule, MdNativeDateModule],
  providers: [CUSTOM_DATE_LOCALE_PROVIDER]
})
export class CustomMd2DatepickerModule {}
