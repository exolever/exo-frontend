import { inject, TestModuleMetadata } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';

import { UserService, WindowRef } from '@app/core';
import { UserServiceStub } from '@core/services/stubs/user-service-stub';
import { LocationsService } from '@applications/shared/services';
import { StubLocationService } from '@applications/shared/stubs';
import { configTestBed } from '@testing/test.common.spec';

import { IntercomService } from './intercom.service';

describe('IntercomService', () => {

  const moduleDef: TestModuleMetadata = {
    imports: [
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      })
    ],
    providers: [
      { provide: UserService, userClass: UserServiceStub },
      { provide: LocationsService, useClass: StubLocationService },
      IntercomService,
      WindowRef
    ]
  };

  configTestBed(moduleDef, false);

  it('should be created', inject([IntercomService], ( service: IntercomService ) => {
    expect( service ).toBeTruthy();
  }));
});
