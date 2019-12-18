import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { EcosystemNavbarComponent } from './ecosystem-navbar.component';
import { CommunicationModule } from '@applications/shared/communication/communication.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MatToolbarModule,
    TranslateModule,
    CommunicationModule
  ],
  declarations: [
    EcosystemNavbarComponent
  ],
  exports: [EcosystemNavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EcosystemNavbarModule { }
