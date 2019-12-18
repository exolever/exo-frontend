import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

import { WindowRef } from '@core/services/browser-api/window-ref.service';
import { ApolloAuthService, ApolloService } from '@core/services/apollo/apollo.service';
import { LocationsService } from '@applications/shared/services';
import { IntercomService } from '@core/services/intercom/intercom.service';
import { reducers as reducer } from '@core/store/user/user.reducer';
import { UserWebsocketService } from '@core/services/user/user-websocket.service';
import { UserEffect } from '@core/store/user/user.effect';
import { SocketModule } from '@applications/sockets/socket.module';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import { errorReducer } from '@core/store/error/error.reducer';

import { LogoutService } from './services/user/logout.service';
import { CoreComponentsModule } from './components/components.module';
import { CountriesProvider } from './services/countries-provider';
import { LocalStorageService, jwtOptionsFactory, UserService, InvitationBuilderService, UrlService } from './services';
import { CustomBreakPointsProvider } from './config/custom-breakpoints';
import { TrackingService } from './services/tracking/tracking.service';
import { SessionStorageService } from '@core/services/sessionStorage.service';
import { CertificationsModule } from './modules/certifications/certifications.module';
import { RolesModule } from '@core/modules/roles/roles.module';


@NgModule({
  imports: [
    ApolloModule,
    HttpLinkModule,
    CommonModule,
    SocketModule,
    StoreModule.forFeature('user', reducer.user),
    StoreModule.forFeature('error', errorReducer.error),
    EffectsModule.forFeature([UserEffect]),
    CertificationsModule,
    RolesModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [LocalStorageService]
      }
    }),
    CoreComponentsModule
  ],
  exports: [
    CoreComponentsModule
  ],
  providers: [
    InvitationBuilderService,
    LocalStorageService,
    SessionStorageService,
    LocationsService,
    UserWebsocketService,
    UserService,
    LogoutService,
    IntercomService,
    UrlService,
    WindowRef,
    ApolloAuthService,
    ApolloService,
    CountriesProvider,
    CustomBreakPointsProvider,
    EarlyParrotService,
    TrackingService
  ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
