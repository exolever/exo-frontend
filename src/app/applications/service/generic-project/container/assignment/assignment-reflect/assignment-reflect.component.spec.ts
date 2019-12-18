import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';
import { Store, StoreModule } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { ServiceInformationService } from '@service/old-project/services/service-info.service';
import { StepModel } from '@applications/workspace/projects/models/step.model';

import { AssignmentReflectContainerComponent } from './assignment-reflect.component';
import * as fromStep from '../../../store/reducer';

describe('AssignmentReflectContainerComponent', () => {
  let component: AssignmentReflectContainerComponent;
  let fixture: ComponentFixture<AssignmentReflectContainerComponent>;
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
      TranslateStubModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('genericProject', fromStep.reducers, {initialState: stepState})
    ],
    declarations: [
      AssignmentReflectContainerComponent
    ],
    providers: [
      { provide: ServiceInformationService, useValue: {getStep() {}}}
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentReflectContainerComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
