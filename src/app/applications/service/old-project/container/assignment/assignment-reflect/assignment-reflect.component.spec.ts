import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';
import { Store, StoreModule } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { ServiceInformationService } from '@service/old-project/services/service-info.service';
import { Step } from '@service/old-project/models/step.model';

import { AssignmentReflectContainerComponent } from './assignment-reflect.component';
import * as fromStep from '../../../store/reducers';

describe('AssignmentReflectContainerComponent', () => {
  let component: AssignmentReflectContainerComponent;
  let fixture: ComponentFixture<AssignmentReflectContainerComponent>;
  let store: Store<AppState>;

  const stepState: fromStep.ServiceState = {
    steps: {
      ids: ['2'],
      entities: {
        '2':  new Step({ pk: '2', name: 'step2', assignments: [] })
      },
      selectedStepPk: '2',
      currentStepPk: '2',
      uploadingDeliverable: false,
      loaded: true,
      loading: false
    },
    teams: {
      ids: [],
      entities: {},
      selectedTeamPk: '',
      loaded: true,
      loading: false
    }
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule,
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
