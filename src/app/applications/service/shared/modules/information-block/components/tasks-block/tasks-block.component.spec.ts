import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { configTestBed } from '@testing/test.common.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { Task, TaskStatus } from '@applications/service/shared/modules/tasks/models';
import { Step } from '@service/old-project/models/step.model';
import * as fromStep from '@service/old-project/store/reducers';
import { ServiceInformationService } from '@applications/service/old-project/services/service-info.service';
import { Assignment } from '@applications/service/shared/models/assignment.model';

import { TasksBlockComponent } from './tasks-block.component';
import { InformationBlock, InformationBlockType } from '../../models/information-block.model';
import { StepsState } from '@service/old-project/store/steps/step.reducer';
import { TeamsState } from '@service/old-project/store/teams/team.reducer';

describe('TasksBlockComponent', () => {
  let component: TasksBlockComponent;
  let fixture: ComponentFixture<TasksBlockComponent>;

  const stepState: fromStep.ServiceState = {
    steps: <StepsState>{
      ids: ['2'],
      entities: {
        '2': new Step({
          pk: '2', name: 'step2', assignments: [
            new Assignment({ pk: '1', name: 'anme', blocks: [] })
          ]
        })
      },
      selectedStepPk: '2',
      currentStepPk: '2',
      uploadingDeliverable: false,
      loaded: true,
      loading: false
    },
    teams: <TeamsState>{
      ids: [],
      entities: {},
      selectedTeamPk: '',
      loaded: true,
      loading: false
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
      StoreModule.forFeature('service', fromStep.reducers, {initialState: stepState})
    ],
    declarations: [
      TasksBlockComponent
    ],
    providers: [
      { provide: ServiceInformationService, useValue: {getStep() {}}},
      { provide: TranslateService, useClass: TranslateService }
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksBlockComponent);
    component = fixture.componentInstance;
    component.taskBlock = {
      pk: '2',
      type: InformationBlockType.Task,
      title: 'Tasks',
      order: 2,
      contents: [
        new Task({
          pk: '1',
          name: 'Task 1 with a very long name which should overflow the space dedicate to it in the design.',
          order: 1,
          status: TaskStatus.ToDo,
          blocks: [
            new InformationBlock({
              pk: '12',
              title: 'Title task 1',
              type: InformationBlockType.Task,
              order: 1,
              contents: [
                {content: 'Some random text for testing purpose', pk: '1', name: 'a', status: TaskStatus.ToDo}
              ]
            })
          ]
        }),
        new Task({
          pk: '2',
          name: 'Task 2',
          order: 2,
          status: TaskStatus.Done,
          blocks: [
            new InformationBlock({
              pk: '121',
              title: 'Title Task 2',
              type: InformationBlockType.Task,
              order: 1,
              contents: [
                {content: 'Some random text for testing purpose', pk: '1', name: 'a', status: TaskStatus.ToDo }
              ]
            })
          ]
        })
      ]
    };
  });
});
