import { inject, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { of as observableOf } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EffectRunner, EffectsTestingModule } from '@testing/modules/effects-testing.module';
import * as userActions from '@core/store/user/user.action';
import { configTestBed } from '@testing/test.common.spec';
import { FakeUserModelFactory } from '@core/faker_factories';
import { UserEffect } from '@core/store/user/user.effect';
import { UserService } from '@app/core';
import { LocalStorageServiceStubProvider } from '@core/services/stubs';
import { UserServiceStub, UrlServiceStub } from '@core/services/stubs';
import { AuthServiceStub } from '@testing/stubs/auth-service-stub';
import { LogoutServiceStubProvider } from '@core/services/user/logout-service-stub';
import { UserWebsocketService } from '@core/services/user/user-websocket.service';
import { SocketService } from '@applications/sockets/service/socket.service';
import { UrlService } from '@app/core/services/api/resolve/urls';
import { RolesService } from '@core/modules/roles/services/roles.service';
import { TrackingServiceStubProvider } from '@core/services/tracking/tracking.service.stub';

describe('UserEffects', () => {
  let runnerEffect: EffectRunner;
  let userEffect: UserEffect;
  let userService: UserService;
  let socketService: SocketService;

  const user = new FakeUserModelFactory();

  const moduleDef: TestModuleMetadata = {
    imports: [
      EffectsTestingModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      EffectsModule.forRoot([UserEffect])
    ],
    providers: [
      UserEffect,
      LogoutServiceStubProvider,
      { provide: UserService, useClass: UserServiceStub },
      { provide: HttpClient, useClass: AuthServiceStub },
      { provide: UrlService, useClass: UrlServiceStub },
      UserWebsocketService,
      LocalStorageServiceStubProvider,
      TrackingServiceStubProvider,
      RolesService,
    ]
  };
  configTestBed(moduleDef);

  beforeEach(inject([EffectRunner, UserEffect], (runner, effect) => {
    userService = TestBed.get(UserService);
    socketService = TestBed.get(SocketService);
    runnerEffect = runner;
    userEffect = effect;
  }));

  it('Should return a GET_USER_SUCCESS action after user load', () => {
    spyOn(userService, 'getUser').and.returnValue(observableOf(user));
    runnerEffect.queue({ type: userActions.GET_USER });
    userEffect.getUser$.subscribe((result: any) => {
      expect(userService.getUser).toHaveBeenCalled();
      expect(result.type).toEqual(userActions.GET_USER_SUCCESS);
    });
  });

  it('Should connect to the websocket before initializing the user', () => {
    spyOn(socketService, 'connect').and.callThrough();
    runnerEffect.queue({ type: userActions.INIT_USER });
    userEffect.initUser$.subscribe((result: any) => {
      expect(socketService.connect).toHaveBeenCalled();
    });
  });

});
