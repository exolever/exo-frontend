import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';

import { BreadcrumbComponent } from '@applications/breadcrumb/container/breadcrumb.component';
import { reducers } from '@applications/breadcrumb/store/breadcrumb.reducers';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { DirectivesModule } from '@shared/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    DirectivesModule,
    StoreModule.forFeature('breadcrumbs', reducers)
  ],
  declarations: [
    BreadcrumbComponent
  ],
  providers: [
    BreadCrumbService
  ],
  exports: [
    BreadcrumbComponent
  ]
})
export class BreadcrumbModule { }
