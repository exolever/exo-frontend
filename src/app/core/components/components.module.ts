import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { ExoCommonModule } from '@shared/exo-common.module';

import {
  BrowserUnsupportedComponent,
  NotFoundComponent
} from '.';

@NgModule({
  imports: [
    CommonModule,
    ExoCommonModule,
    TranslateModule,
    RouterModule,
  ],
  declarations: [
    BrowserUnsupportedComponent,
    NotFoundComponent
  ],
  exports: [
    BrowserUnsupportedComponent,
    NotFoundComponent
  ]
})
export class CoreComponentsModule { }
