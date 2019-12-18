import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf, of } from 'rxjs';

import { combineReducers, StoreModule } from '@ngrx/store';

import { configTestBed } from '@testing/test.common.spec';
import { MockMatchMediaProvider, ObservableMediaMockProvider } from '@testing/mocks/flex-layout.mocks';
import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import * as fromUser from '@core/store/user/user.reducer';
import { FakeUserModelFactory } from '@core/faker_factories';
import { EcosystemNavbarComponent } from './ecosystem-navbar.component';
import { URL_SERVICE_STUB_PROVIDER, USER_SERVICE_STUB_PROVIDER } from '@core/services/stubs';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { MailboxService } from '@ecosystem/modules/mailbox/services/mailbox.service';
import { initialState, reducer } from '@applications/shared/communication/store/reducer/communication.reducer';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import {SessionStorageServiceStub} from '@core/services/stubs/session-storage-service-stub';
import {SessionStorageService} from '@core/services/sessionStorage.service';

describe('EcosystemNavbarComponent', () => {
  let component: EcosystemNavbarComponent;
  let fixture: ComponentFixture<EcosystemNavbarComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      LayoutModule,
      BrowserAnimationsModule,
      RouterTestingModule,
      StoreModule.forRoot({'user': combineReducers(fromUser.reducers, {
          user: new FakeUserModelFactory().modelPropertiesCustom([])
        })
      }, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('communication', reducer, {initialState: initialState} ),
      TranslateStubModule
    ],
    declarations: [EcosystemNavbarComponent],
    providers: [
      MockMatchMediaProvider,
      URL_SERVICE_STUB_PROVIDER,
      ObservableMediaMockProvider,
      { provide: SessionStorageService, useClass: SessionStorageServiceStub },
      { provide: EarlyParrotService, useValue: {
        createSubscribe() { return observableOf(); },
        getCampaigns() { return observableOf([]); },
      }},
      { provide: CommunicationService, useValue: {getMailboxConversations() {
        return of([]);
          }}},
      { provide: MailboxService, useValue: {getAllConversations() {
        return of([]);
          }}},
      USER_SERVICE_STUB_PROVIDER
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    // get component
    fixture = TestBed.createComponent(EcosystemNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

});
