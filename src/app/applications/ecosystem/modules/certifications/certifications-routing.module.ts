import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  CertificationsLayoutComponent
} from '@ecosystem/modules/certifications/containers/certifications-layout/certifications-layout.component';
import {
  CertificationsListComponent
} from '@ecosystem/modules/certifications/containers/certifications-list/certifications-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: CertificationsLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CertificationsListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class CertificationsRoutingModule { }
