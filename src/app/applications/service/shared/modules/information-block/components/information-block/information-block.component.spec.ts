/*
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { configTestBed } from '@testing/test.common.spec';
import { InformationBlockType } from '@service/modules/information-block/models';
import { ServiceInformationService } from '@service/services/service-info.service';
import { Step } from '@service/models'

import * as fromStep from '@service/store/reducers';
import { InformationBlockComponent } from './information-block.component';
import { Assignment } from '@service/models/assignment.model';

describe('InformationBlockComponent', () => {
  let component: InformationBlockComponent;
  let fixture: ComponentFixture<InformationBlockComponent>;

  const stepState: fromStep.ServiceState = {
    steps: {
      ids: ['2'],
      entities: {
        '2': new Step({
          pk: '2', name: 'step2', assignments: [
            new Assignment({ pk: '1', name: 'anme', blocks: [] })
          ]
        })
      },
      selectedStepPk: '2'
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
      StoreModule.forRoot({}),
      StoreModule.forFeature('service', fromStep.reducers, {initialState: stepState})
    ],
    providers: [
      { provide: ServiceInformationService, useValue: {getStep() {}}}
    ],
    declarations: [
      InformationBlockComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationBlockComponent);
    component = fixture.componentInstance;
    component.block = {
      contents: [],
      order: 1,
      pk: '1',
      title: 'Information block 1',
      type: InformationBlockType.Resource
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
