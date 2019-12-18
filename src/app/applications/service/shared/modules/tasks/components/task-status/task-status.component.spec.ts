import { ComponentFixture, TestModuleMetadata, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configTestBed } from '@testing/test.common.spec';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';

import { TaskStatusComponent } from './task-status.component';
import { Task, TaskStatus} from '../../models';

describe('TaskStatusComponent', () => {
  let component: TaskStatusComponent;
  let fixture: ComponentFixture<TaskStatusComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule
    ],
    declarations: [
      TaskStatusComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatusComponent);
    component = fixture.componentInstance;
    component.task = new Task({
      pk: '1',
      name: 'Task name',
      order: 1,
      status: TaskStatus.ToDo,
      blocks: []
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
