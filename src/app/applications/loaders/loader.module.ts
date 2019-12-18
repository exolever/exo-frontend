import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule, MatProgressSpinnerModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import {
  FullScreenSpinnerLoaderComponent
} from './components/full-screen-spinner-loader/full-screen-spinner-loader.component';
import {
  ComponentSpinnerLoaderComponent
} from './components/component-spinner-loader/component-spinner-loader.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  declarations: [
    FullScreenSpinnerLoaderComponent,
    ComponentSpinnerLoaderComponent
  ],
  exports: [
    FullScreenSpinnerLoaderComponent,
    ComponentSpinnerLoaderComponent
  ]
})
export class LoaderModule { }
