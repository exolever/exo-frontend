import { ComponentFixture, TestModuleMetadata, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { configTestBed } from '@testing/test.common.spec';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { ActivatedRouteStub } from '@testing/stubs/router-stubs';

import { TaskItemListComponent } from './task-item-list.component';
import { Task, TaskStatus} from '../../models';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

describe('TaskItemListComponent', () => {
  let component: TaskItemListComponent;
  let fixture: ComponentFixture<TaskItemListComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
  const testParams = new Object();
  Object.assign(testParams, {
    pkService: 1,
    pkTeam: 1,
    pk: 1,
    get(key: string) {}
  });
  activatedRoute.testParams = testParams;
  activatedRoute['parent'] = {};
  activatedRoute['parent'] = activatedRoute;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule,
      RouterTestingModule
    ],
    declarations: [
      TaskItemListComponent
    ],
    providers: [
      URL_SERVICE_STUB_PROVIDER,
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: MatDialog, useValue: {} },
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskItemListComponent);
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
