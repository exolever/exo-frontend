import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AdvisoryCallFormLayoutComponent
} from './advisory-call-form-layout/advisory-call-form-layout.component';
import { AdvisoryCallListComponent } from './advisory-call-list/advisory-call-list.component';
import { AdvisoryCallDetailLayoutComponent } from './advisory-call-detail-layout/advisory-call-detail-layout.component';

const advisoryCallRoutes: Routes = [
  {
    path: '',
    component: AdvisoryCallListComponent
  },
  {
    path: 'new',
    component: AdvisoryCallFormLayoutComponent,
  },
  {
    path: 'edit/:pk',
    component: AdvisoryCallFormLayoutComponent,
  },
  {
    path: ':pk',
    component: AdvisoryCallDetailLayoutComponent,
    // tslint:disable-next-line:max-line-length
    loadChildren: () => import('@opportunities/modules/admin/opportunities-admin.module').then(m => m.OpportunitiesAdminModule)
  },
];
@NgModule({
  imports: [RouterModule.forChild(advisoryCallRoutes)],
  exports: [RouterModule]
})
export class AdvisoryCallRoutingModule { }
