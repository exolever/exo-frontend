import { inject, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { of as observableOf, empty } from 'rxjs';

import { EffectRunner, EffectsTestingModule } from '@testing/modules/effects-testing.module';
import { configTestBed } from '@testing/test.common.spec';
import { Pagination } from '@core/interfaces/pagination.interface';

import { MyJobsEffect } from './my-jobs.effect';
import { MyJobsService } from '../services/my-jobs.service';
import * as actionJobs from './my-jobs.action';
import { Job } from '../models/job.model';
import { JobFakeFactory } from './../faker-factories/job-fake.model';
import { Store } from '@ngrx/store';

describe('My Jobs Effect', () => {
  let runnerEffect: EffectRunner;
  let jobsEffect: MyJobsEffect;
  let service: MyJobsService;

  const jobs = <Pagination<Job>>{
    count: '2',
    next: null,
    previous: null,
    results: [new JobFakeFactory(), new JobFakeFactory()]
  };

  const store = {
    pipe: () => observableOf({
      loading: false,
      loaded: true,
      entities: {},
      ids: [],
      searchBy: '',
      pageIndex: 1,
      pageSize: 1
    })
  };

  const moduleDef: TestModuleMetadata = {
    imports: [EffectsTestingModule],
    providers: [
      MyJobsEffect,
      { provide: Store, useValue: store },
      { provide: MyJobsService, useValue: { getMyJobsList() {return empty(); } }}
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(inject([EffectRunner, MyJobsEffect], (runner, effect) => {
    service = TestBed.get(MyJobsService);
    runnerEffect = runner;
    jobsEffect = effect;
  }));

  it('should return a LOAD_JOBS_SUCCESS after execute a LOAD_JOBS', () => {
    spyOn(service, 'getMyJobsList').and.returnValue(observableOf(jobs));
    runnerEffect.queue({type: actionJobs.MyJobsActionEnum.LOAD_JOBS});
    jobsEffect.loading$.subscribe((result: any) => {
      expect(service.getMyJobsList).toHaveBeenCalled();
      expect(result.type).toEqual(actionJobs.MyJobsActionEnum.LOAD_JOBS_SUCCESS);
    });
  });
});
