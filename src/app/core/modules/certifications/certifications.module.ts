import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducer as certficationsReducer } from './store/certifications.reducer';
import { CertificationsEffect } from './store/certifications.effect';
import { CertificationsDeserializerService, CertificationsService } from './services';

@NgModule({
  imports: [
    StoreModule.forFeature('certifications', certficationsReducer),
    EffectsModule.forFeature([CertificationsEffect]),
  ],
  providers: [
    CertificationsService,
    CertificationsDeserializerService
  ]
})

export class CertificationsModule { }
