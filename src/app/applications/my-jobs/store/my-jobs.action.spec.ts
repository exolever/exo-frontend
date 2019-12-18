import { Pagination } from '@core/interfaces/pagination.interface';

import { JobFakeFactory } from './../faker-factories/job-fake.model';
import { Job } from './../models/job.model';
import * as actionMyJobs from './my-jobs.action';

const payload = {
  items: [],
  loading: false
};

describe('My Jobs Actions', () => {
  it('Should create a Load my jobs action', () => {
    const action = new actionMyJobs.LoadJobs();

    expect({ ...action }).toEqual({
      type: actionMyJobs.MyJobsActionEnum.LOAD_JOBS
    });
  });

  it('Should create a Load My Jobs success action', () => {
    const jobs = <Pagination<Job>>{
      count: '2',
      next: null,
      previous: null,
      results: [new JobFakeFactory(), new JobFakeFactory()]
    };

    const action = new actionMyJobs.LoadJobsSuccess(jobs);
    expect({ ...action }).toEqual({
      type: actionMyJobs.MyJobsActionEnum.LOAD_JOBS_SUCCESS,
      payload: jobs
    });
  });

  it('Should create a Load My Jobs Fail action', () => {
    const action = new actionMyJobs.LoadJobsFail(payload);

    expect({ ...action }).toEqual({
      type: actionMyJobs.MyJobsActionEnum.LOAD_JOBS_FAIL,
      payload
    });
  });
});
