import { NgModule } from '@angular/core';

import { CertificatesDialogComponent } from '@applications/certificates/dialogs/certificates-dialog.component';
import { ExoCommonModule } from '@shared/exo-common.module';
import {
  CertificationCardsComponent
} from '@applications/certificates/components/certification-cards/certification-cards.component';
import { PipeModule } from '@shared/pipes/pipes.module';

@NgModule({
  imports: [
    ExoCommonModule,
    PipeModule
  ],
  declarations: [
    CertificatesDialogComponent,
    CertificationCardsComponent
  ],
  entryComponents: [
    CertificatesDialogComponent,
    CertificationCardsComponent
  ],
  exports: [
    CertificationCardsComponent
  ]
})
export class CertificatesModule {}
