import { inject, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { EffectRunner, EffectsTestingModule } from '@testing/modules/effects-testing.module';
import { configTestBed } from '@testing/test.common.spec';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

import { ProjectService } from '../../services/project.service';
import { FakeGenericProjectFactory } from '../../models/project-fake.model';
import * as projectsActions from '../action/projects.action';
import * as fromProjects from '../reducer/index';
import { INITIAL_VALUES } from '../reducer/projects.reducer';
import { ProjectsEffect } from './projects.effect';
import { ProjectsState } from '../reducer/index';

describe('ProjectsEffect', () => {
  let runnerEffect: EffectRunner;
  let projectsEffect: ProjectsEffect;
  let serviceProject: ProjectService;

  const project = new FakeGenericProjectFactory();

  const moduleDef: TestModuleMetadata = {
    imports: [
      EffectsTestingModule,
      TranslateStubModule,
      MatSnackBarModule,
      NoopAnimationsModule,
      RouterTestingModule,
      StoreModule.forRoot({}),
      StoreModule.forFeature('workspaceProjects',
        fromProjects.reducers,
        {
          initialState: <ProjectsState>{ projects: INITIAL_VALUES }
        }
      )
    ],
    providers: [
      TranslateService,
      { provide: ProjectService, useValue: {
          createProject() {},
          editProject() {},
          getProjects() {},
          getProjectDetails() {},
          deleteProject() {},
          publish() {}
        }
      },
      ProjectsEffect,
      URL_SERVICE_STUB_PROVIDER
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(inject([EffectRunner, ProjectsEffect], (runner: EffectRunner, effect: ProjectsEffect) => {
    serviceProject = TestBed.get(ProjectService);
    runnerEffect = runner;
    projectsEffect = effect;
  }));

  it('Should return a LOAD_SUCCESS after OK execute a LOAD', () => {
    const spy = spyOn(serviceProject, 'getProjects').and.returnValue(observableOf({
      results: [project],
      count: '1',
      next: '',
      previous: ''
    }));

    projectsEffect.loading$.subscribe((result: any) => {
      expect(spy).toHaveBeenCalled();
      expect(result.type).toEqual(projectsActions.LoadSuccess);
    });

    runnerEffect.queue({
      type: projectsActions.Load
    });
  });

  it('Should return a LOAD_DETAIL_SUCCESS after OK execute a LOAD_DETAIL', () => {
    spyOn(serviceProject, 'getProjectDetails').and.returnValue(observableOf(project));

    projectsEffect.loadingDetails$.subscribe((result: any) => {
      expect(serviceProject.getProjectDetails).toHaveBeenCalled();
      expect(result.type).toEqual(projectsActions.LoadDetailsSuccess);
    });

    runnerEffect.queue({
      type: projectsActions.LoadDetails,
      payload: 1
    });
  });

  it('Should return a CREATE_SUCCESS after OK execute a CREATE', () => {
    spyOn(serviceProject, 'createProject').and.returnValue(observableOf(project));

    runnerEffect.queue({type: projectsActions.Create});

    projectsEffect.creating$.subscribe((result: any) => {
      expect(serviceProject.createProject).toHaveBeenCalled();
      expect(result.type).toEqual(projectsActions.CreateSuccess);
    });
  });

  it('Should return a EDIT_SUCCESS after OK execute a EDIT', () => {
    spyOn(serviceProject, 'editProject').and.returnValue(observableOf(project));

    projectsEffect.editing$.subscribe((result: any) => {
      expect(serviceProject.editProject).toHaveBeenCalled();
      expect(result.type).toEqual(projectsActions.EditSuccess);
    });

    runnerEffect.queue({
      type: projectsActions.Edit,
      payload: new FakeGenericProjectFactory()
    });
  });

  it('Should return a DELETE_SUCCESS after OK execute a DELETE', () => {
    spyOn(serviceProject, 'deleteProject').and.returnValue(observableOf(project));
    projectsEffect.deleting$.subscribe((result: any) => {
      expect(serviceProject.deleteProject).toHaveBeenCalled();
      expect(result.type).toEqual(projectsActions.DeleteSuccess);
    });
    runnerEffect.queue({
      type: projectsActions.Delete,
      payload: new FakeGenericProjectFactory()
    });
  });

  it('Should return a LOAD after OK execute an SEARCH', () => {
    projectsEffect.searching$.subscribe((result: any) => {
      expect(result.type).toEqual(projectsActions.Load);
    });
    runnerEffect.queue({
      type: projectsActions.SetSearch,
      payload: ''
    });
  });

  it('Should return a LOAD after OK execute an PAGINATE', () => {
    projectsEffect.paginating$.subscribe((result: any) => {
      expect(result.type).toEqual(projectsActions.Load);
    });
    runnerEffect.queue({
      type: projectsActions.SetPagination,
      payload: {pageIndex: 1, pageSize: 15}
    });
  });

  it('Should return a LOAD after OK execute an SORTBY', () => {
    projectsEffect.sortBy$.subscribe((result: any) => {
      expect(result.type).toEqual(projectsActions.Load);
    });
    runnerEffect.queue({
      type: projectsActions.SortBy,
      payload: { sortBy: 'date'}
    });
  });

  it('Should return a PUBLISH_SUCCESS after OK execute a PUBLISH', () => {
    spyOn(serviceProject, 'publish').and.returnValue(observableOf(project));

    projectsEffect.publishing$.subscribe((result: any) => {
      expect(serviceProject.publish).toHaveBeenCalled();
      expect(result.type).toEqual(projectsActions.PublishSuccess);
    });

    runnerEffect.queue({
      type: projectsActions.Publish,
      payload: 1
    });
  });
});

