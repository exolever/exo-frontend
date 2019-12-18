import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';

import { configTestBed } from '@testing/test.common.spec';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { FakeUserModelFactory } from '@core/faker_factories';

import { WindowRef } from '@app/core';
import { LocalStorageServiceStubProvider, URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';
import { NavigationService } from '@shared/navigation/navigation.service';

import { UserMenuComponent } from '@shared/components/user-menu/user-menu.component';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import { of as observableOf } from 'rxjs';
import { SessionStorageServiceStub } from '@core/services/stubs/session-storage-service-stub';
import { SessionStorageService } from '@core/services/sessionStorage.service';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
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
      URL_SERVICE_STUB_PROVIDER,
      LocalStorageServiceStubProvider,
      NavigationService,
      {
        provide: EarlyParrotService, useValue: {
          createSubscribe() {
            return observableOf();
          },
          getCampaigns() {
            return observableOf([]);
          },
        }
      },
      WindowRef,
      { provide: SessionStorageService, useClass: SessionStorageServiceStub },
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    component.user = new FakeUserModelFactory().modelPropertiesCustom();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

});
