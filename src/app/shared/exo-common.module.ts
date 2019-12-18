import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MomentModule } from 'ngx-moment';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';

import { AngularMaterialModule } from '@shared/angular-material/angular-material.module';
import { FragmentPolyfillModule } from '@core/fragment-polyfill/fragment-polyfill.module';
import {
  CustomFlexDirective,
  CustomFlexAlignDirective,
  CustomLayoutDirective,
  CustomLayoutAlignDirective,
  CustomFlexFillDirective,
  CustomShowHideDirective,
  CustomLayoutGapDirective
} from '@core/config/custom-breakpoints';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    InfiniteScrollModule,
    TranslateModule,
    MomentModule,
    FlexLayoutModule,
    FragmentPolyfillModule.forRoot({ smooth: true })
  ],
  declarations: [
    CustomFlexDirective,
    CustomFlexAlignDirective,
    CustomLayoutDirective,
    CustomLayoutAlignDirective,
    CustomFlexFillDirective,
    CustomShowHideDirective,
    CustomLayoutGapDirective
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    TranslateModule,
    MomentModule,
    InfiniteScrollModule,
    FragmentPolyfillModule,
    CustomFlexDirective,
    CustomFlexAlignDirective,
    CustomLayoutDirective,
    CustomLayoutAlignDirective,
    CustomFlexFillDirective,
    CustomShowHideDirective,
    CustomLayoutGapDirective,
    CustomShowHideDirective
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ExoCommonModule { }
