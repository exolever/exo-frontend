import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationsLayoutComponent } from './containers/certifications-layout/certifications-layout.component';
import { CertificationsRoutingModule } from '@ecosystem/modules/certifications/certifications-routing.module';
import { SharedModule } from '@shared/shared.module';
import { CertificatesModule } from '@applications/certificates/certificates.module';
import { CertificationsListComponent } from './containers/certifications-list/certifications-list.component';

@NgModule({
  declarations: [
    CertificationsLayoutComponent,
    CertificationsListComponent,
  ],
  imports: [
    CommonModule,
    CertificationsRoutingModule,
    SharedModule,
    CertificatesModule,
  ],
})
export class CertificationsModule { }
