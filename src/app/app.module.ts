import { NgModule, Injectable, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatIconModule,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
  MatPaginatorIntl,
} from '@angular/material';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HttpClient, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// external libraries
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as MomentTZ from 'moment-timezone';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { AgmCoreModule } from '@agm/core';
import { CookieService } from 'ngx-cookie-service';

// ngrx store
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Global config
import { environment } from '@environments/environment';
import { LANGUAGES_CONF } from '@app/app-config';

// modules
import { LoaderModule } from '@loaders/loader.module';
import { CoreModule } from '@core/core.module';
import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';

import { XsrfInterceptor } from '@core/services/interceptors/xsrfInterceptor.service';
import { Error410Service } from '@core/services/interceptors/error-410.service';
import { ServerErrorInterceptor } from '@core/services/interceptors/server-error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as Sentry from '@sentry/browser';
import { icons } from './shared/icons/fa-icons';
import { RedirectToService } from './routing/guards/redirect-to.service';
import { RedirectToGuard } from './routing/guards/redirect-to.guard';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  sentryEnv = 'prod';
  constructor(
  ) {
    if (location.hostname.includes('localhost') || location.hostname.includes('127.0.0.1')) {
      this.sentryEnv = 'localhost';
    }

    if (location.hostname.includes('.qa.') ) {
      this.sentryEnv = 'sandbox';
    }

    if (this.sentryEnv !== 'localhost') {
      Sentry.init({ dsn: environment.SENTRY_DSN, release: environment.SOURCE_NAME, environment: this.sentryEnv});
    }

  }
  handleError(error) {
    if (this.sentryEnv !== 'localhost') {
      Sentry.captureException(error.originalError || error);
    }

    throw error;
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const globalRippleConfig: RippleGlobalOptions = {
  disabled: true
};

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();
    this.nextPageLabel = this.translate.instant('MATERIAL.PAGINATOR.NEXT_PAGE');
    this.previousPageLabel = this.translate.instant('MATERIAL.PAGINATOR.PREVIOUS_PAGE');
    this.itemsPerPageLabel = this.translate.instant('MATERIAL.PAGINATOR.ITEMS_PER_PAGE');
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    FontAwesomeModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LoaderModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: 'ExO'
    }),
    MatIconModule,
    CustomMd2DatepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.GMAPS_KEY,
      libraries: ['places']
    })
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    { provide: APP_BASE_HREF, useValue: environment.APP_BASE_HREF },
    RedirectToGuard,
    RedirectToService,
    CookieService,
    Error410Service
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private translate: TranslateService) {
    library.add(...icons);
    this.translate.addLangs(LANGUAGES_CONF.ALLOWED_LANGUAGES);
    this.translate.setDefaultLang(LANGUAGES_CONF.DEFAULT_LANGUAGE);
    const cachedLanguage = localStorage.getItem(LANGUAGES_CONF.KEY_LOCALSTORAGE);
    if (cachedLanguage) {
      this.translate.use(cachedLanguage);
      MomentTZ.locale(cachedLanguage);
    }
  }
}
