import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatStepperModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {createCustomElement} from '@angular/elements';
import {RouterModule} from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ScoreComponent } from './score/score.component';
import { AgreementComponent } from './agreement/agreement.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    ScoreComponent,
    AgreementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatStepperModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 80,
      animationDuration: 300,
      startFromZero: false,
      responsive: true,
      space: -6,
      outerStrokeWidth: 6,
      outerStrokeColor: '#6f23ff',
      innerStrokeColor: '#e7e8ea',
      innerStrokeWidth: 6,
      titleFontSize: '10'
    }),
    RouterModule.forRoot([]),
    MatCheckboxModule,
  ],
  providers: [],
  entryComponents: [AppComponent],
  bootstrap: []
})
export class AppModule {
  constructor(
    private injector: Injector
  ) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(AppComponent, {injector: this.injector});
    customElements.define('exo-exq-container', el);
  }
}

