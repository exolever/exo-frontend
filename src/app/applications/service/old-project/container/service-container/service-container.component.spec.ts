import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';

import { configTestBed } from '@testing/test.common.spec';
import { WindowRef } from '@app/core';
import { FakeUserModelFactory } from '@core/faker_factories';
import { IntercomService } from '@core/services/intercom/intercom.service';
import { IntercomServiceStub } from '@core/services/intercom/intercom.service.stub';
import { LocalStorageService, UrlService } from '@core/services';
import { LocalStorageServiceStub, UrlServiceStub } from '@core/services/stubs';
import { MockMatchMediaProvider, ObservableMediaMockProvider } from '@testing/mocks/flex-layout.mocks';
import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import * as fromUser from '@core/store/user/user.reducer';
import { ProjectServiceStub } from '@applications/service/old-project/services/project-service-stub';

import { ServiceContainerComponent } from './service-container.component';
import { Step } from '@service/old-project/models/step.model';
import { Assignment } from '@service/shared/models/assignment.model';
import { TeamSelectionBarComponent } from '@service/shared/components/team-selection-bar/team-selection-bar.component';
import { ServiceInformationStubServiceProvider } from '../../services/service-info-stub.service';
import * as fromProjects from '../../store/project';
import * as fromService from '../../store/reducers';
import { ProjectService } from '@service/old-project/services/project.service';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { EarlyParrotService } from '@core/services/early-parrot.service';
import { of as observableOf } from 'rxjs';
import {SessionStorageServiceStub} from '@core/services/stubs/session-storage-service-stub';
import {SessionStorageService} from '@core/services/sessionStorage.service';

describe('ServiceContainerComponent', () => {

  let component: ServiceContainerComponent;
  let fixture: ComponentFixture<ServiceContainerComponent>;

  const userInitialState: fromUser.UserState = {
    user: new FakeUserModelFactory(),
    loggedIntercom: false
  };

  const initialServiceState = <fromService.ServiceState> {
    steps: {
        entities: {
          '2': new Step({pk: '2', name: 'step2', assignments: [new Assignment({ pk: '1', name: 'anme', blocks: [] })]})
        },
        ids: ['2'],
        selectedStepPk: '2',
        currentStepPk: '2',
        uploadingDeliverable: false,
        loaded: true,
        loading: false
    },
    teams: {
      entities: {},
      ids: [],
      selectedTeamPk: undefined,
      loaded: true,
      loading: false
    }
  };

  const initialProjectsState = <fromProjects.ProjectsState> {
    list: {
      ids: [],
      loaded: true,
      loading: false
    },
    projects: {
      entities: {},
      ids: [],
      selectedProjectPk: undefined
    }
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      LayoutModule,
      BrowserAnimationsModule,
      RouterTestingModule,
      TranslateStubModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('user', fromUser.reducers.user, {initialState: userInitialState} ),
      StoreModule.forFeature('service', fromService.reducers, {initialState: initialServiceState}),
      StoreModule.forFeature('projects', fromProjects.reducers, {initialState: initialProjectsState})
    ],
    declarations: [
      ServiceContainerComponent,
      TeamSelectionBarComponent
    ],
    providers: [
      MockMatchMediaProvider,
      ServiceInformationStubServiceProvider,
      ObservableMediaMockProvider,
      WindowRef,
      { provide: ProjectService, useClass: ProjectServiceStub },
      { provide: CommunicationService, useValue: { totalUnreadConversations() { }}},
      { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      { provide: SessionStorageService, useClass: SessionStorageServiceStub },
      { provide: IntercomService, useClass: IntercomServiceStub },
      { provide: UrlService, useClass: UrlServiceStub },
      { provide: EarlyParrotService, useValue: {
          createSubscribe() { return observableOf(); },
          getCampaigns() { return observableOf([]); },
        }},
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    // get component
    fixture = TestBed.createComponent(ServiceContainerComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidenav state', () => {
    const previousState = component.isOpenedSidenav;
    const spy = spyOn(component.drawer, 'toggle');
    component.onSidenavToggle();

    expect(spy).toHaveBeenCalled();
    expect(component.isOpenedSidenav).toBe(!previousState);
  });

});
