import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatStepperModule,
  MatSelectModule,
  MatIconModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatRadioModule
} from '@angular/material';

import { ExoAlertModule, ExoButtonModule } from '@openexo/design-system';

import { CertificationFormComponent } from './certification-form/certification-form.component';
import { HumanizeFormErrorsPipe } from './pipes/humanize-form-errors.pipe';
import { ApiService } from './api.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    ExoAlertModule,
    ExoButtonModule,
    MatRadioModule
  ],
  declarations: [
    CertificationFormComponent,
    HumanizeFormErrorsPipe
  ],
  providers: [
    ApiService
  ],
  entryComponents: [
    CertificationFormComponent
  ],
  bootstrap: []
})
export class AppModule {
  constructor(
    private injector: Injector
  ) {}

  ngDoBootstrap() {
    const el = createCustomElement(CertificationFormComponent, { injector: this.injector });
    customElements.define('app-certification-form', el);
  }
}

