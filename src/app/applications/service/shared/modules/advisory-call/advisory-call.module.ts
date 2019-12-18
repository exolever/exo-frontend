import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpportunitiesModule } from '@applications/ecosystem/modules/opportunities/opportunities.module';
import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@applications/loaders/loader.module';
import { OpportunitiesAdminModule } from '@opportunities/modules/admin/opportunities-admin.module';
import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';

import { AdvisoryCallListComponent } from './advisory-call-list/advisory-call-list.component';
import { AdvisoryCallFormLayoutComponent } from './advisory-call-form-layout/advisory-call-form-layout.component';
import { AdvisoryCallRoutingModule } from './advisory-call-routing.module';
import { AdvisoryCallFormComponent } from './advisory-call-form-layout/advisory-call-form/advisory-call-form.component';
import { AdvisoryCallDetailLayoutComponent } from './advisory-call-detail-layout/advisory-call-detail-layout.component';
import {
  OpportunitiesFieldsSharedModule
} from '@shared/modules/opportunities-fields-shared/opportunities-fields-shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoaderModule,
    AdvisoryCallRoutingModule,
    OpportunitiesModule,
    OpportunitiesAdminModule,
    CustomMd2DatepickerModule,
    OpportunitiesFieldsSharedModule
  ],
  declarations: [
    AdvisoryCallListComponent,
    AdvisoryCallFormLayoutComponent,
    AdvisoryCallFormComponent,
    AdvisoryCallDetailLayoutComponent,
  ]
})
export class AdvisoryCallModule { }
