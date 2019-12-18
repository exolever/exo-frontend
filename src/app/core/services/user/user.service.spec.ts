import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, Subscription } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';

import { LogoutServiceStubProvider } from '@core/services/user/logout-service-stub';
import { UrlService, UserService } from '@app/core';
import { UserResponseFakeModel } from '@core/faker_factories/user-response-fake.model';
import { UserEffect } from '@core/store/user/user.effect';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { SocketService } from '@applications/sockets/service/socket.service';
import { UserWebsocketService } from '@core/services/user/user-websocket.service';
import { configTestBed } from '@testing/test.common.spec';
import { AuthServiceStub } from '@testing/stubs/auth-service-stub';
import { UrlServiceStub } from '@core/services/stubs';
import { SocketServiceStub } from '@applications/sockets/service/socket.service-stub';
import { UserModel } from '@core/models';

import { FakeUserModelFactory } from '../../faker_factories';
import { TrackingServiceStubProvider } from '../tracking/tracking.service.stub';

describe ( 'UserService', () => {
  let fakeUserResponse: UserResponseFakeModel;
  let service: UserService;
  let store: Store<AppState>;
  let subscription: Subscription;

  const initialState: fromUser.UserState = {
    user: new FakeUserModelFactory(),
    loggedIntercom: false
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictActionImmutability: false,
          strictActionSerializability: false,
          strictStateImmutability: false,
          strictStateSerializability: false
        }
      }),
      StoreModule.forFeature('user', fromUser.reducers.user, {initialState} ),
      EffectsModule.forRoot([UserEffect]),
      HttpClientTestingModule
    ],
    providers: [
      { provide: UrlService, useClass: UrlServiceStub },
      { provide: HttpClient, useClass: AuthServiceStub },
      { provide: SocketService, useClass: SocketServiceStub },
      UserService,
      UserWebsocketService,
      LogoutServiceStubProvider,
      TrackingServiceStubProvider
    ]
  };

  configTestBed(moduleDef, false);

  beforeAll(() => {
    subscription = new Subscription();
  });

  beforeEach(() => {
    service = TestBed.get(UserService);
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('should create', () => {
    expect( service ).toBeTruthy();
  });

  it('should correctly store the user after receiving server response', () => {
    fakeUserResponse = new UserResponseFakeModel();
    service.updateUserStore(fakeUserResponse);
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(1);

    subscription = service.user$.subscribe( user => {
      expect( user.pk ).toEqual( fakeUserResponse.id );
      expect( user.email ).toEqual( fakeUserResponse.email );
      expect( user.uuid ).toEqual( fakeUserResponse.uuid );
      expect( user.shortName ).toEqual( fakeUserResponse.shortName );
      expect( user.bioMe ).toEqual( fakeUserResponse.bioMe );
      expect( user.aboutMe ).toEqual( fakeUserResponse.aboutMe );
    });
  });

  it('should return an Observable when the methos getUser is called', () => {
    const response = service.getUser();
    expect(response instanceof Observable).toBeTruthy();
    subscription = response.subscribe( res => {
      expect(res instanceof UserModel).toBeTruthy();
    });
  });

  it('should get custom data user from function', () => {
    // this test was done in a more complex way, I refactored it, but it I cn see it only checks that
    // the modelPropertiesCustom method of the factory works correctly, if advised in the code review I can delete it
    const fakeUser = new FakeUserModelFactory();
    fakeUser.modelPropertiesCustom(
      [{ name: 'email', data: 'exo@works.es' }, { name: 'city', data: 'Zafra' }]
    );

    expect ( fakeUser.email ).toEqual( 'exo@works.es' );
    expect ( typeof fakeUser.pk ).toEqual( 'string' );
    expect ( fakeUser.shortName ).toBeDefined();
  });
});
