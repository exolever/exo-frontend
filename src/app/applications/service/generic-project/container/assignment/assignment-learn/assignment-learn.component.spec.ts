import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { configTestBed } from '@testing/test.common.spec';
import { Store, StoreModule } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as fromStep from '@service/generic-project/store/reducer';
import { StepModel } from '@applications/workspace/projects/models/step.model';
import { ServiceInformationService } from '@applications/service/old-project/services/service-info.service';

import { AssignmentLearnContainerComponent } from './assignment-learn.component';
import { UrlService, UserService, LocalStorageService } from '@core/services';
import { UrlServiceStub, UserServiceStub, LocalStorageServiceStub } from '@core/services/stubs';

describe('AssignmentLearnComponent', () => {
  let component: AssignmentLearnContainerComponent;
  let fixture: ComponentFixture<AssignmentLearnContainerComponent>;
  let store: Store<AppState>;

  const stepState: fromStep.GenericProjectsState = {
    genericProject: undefined,
    stepsGenericProject: {
      ids: [2],
      entities: {
        2:  new StepModel({ pk: 2, name: 'step2', assignments: [] })
      },
      selectedStepPk: 2,
      currentStepPk: 2,
      uploadingDeliverable: false,
      loaded: true,
      loading: false
    },
    teamsGenericProject: {
      ids: [],
      entities: {},
      selectedTeamPk: undefined,
      loaded: true,
      loading: false
    },
    membersGenericProject: {
      ids: [],
      entities: {},
      count: 0,
      loaded: false,
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      searchBy: ''
    }
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      RouterTestingModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('service', fromStep.reducers, {initialState: stepState})
    ],
    declarations: [
      AssignmentLearnContainerComponent
    ],
    providers: [
      { provide: ServiceInformationService, useValue: {getStep() {}}},
      { provide: UrlService, useClass: UrlServiceStub },
      { provide: UserService, useClass: UserServiceStub },
      { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      {
        provide: HttpXsrfTokenExtractor,
        useValue: { getToken() { return ''; } }
      },
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentLearnContainerComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
