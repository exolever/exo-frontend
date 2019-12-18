import { JobFakeFactory } from './../faker-factories/job-fake.model';
import { MyJobsState } from './my-jobs.reducer';
import * as fromJobs from './my-jobs.reducer';
import * as actionJobs from './my-jobs.action';
import { Job } from '../models/job.model';
import { Pagination } from '@core/interfaces/pagination.interface';

describe('My Jobs reducer', () => {
  const initialState = <MyJobsState>{
    entities: {
      '1': new JobFakeFactory(),
      '2': new JobFakeFactory()
    },
    ids: ['1', '2'],
    loading: false,
    pageIndex:  undefined,
    count:  undefined,
    pageSize: undefined,
    searchBy: ''
  };

  it('Should return the default state', () => {
    const action = {} as any;
    const state = fromJobs.reducer(initialState, action);

    expect(state).toEqual(initialState);
  });

  it('Should set loading to true', () => {
    const action = new actionJobs.LoadJobs();
    const state = fromJobs.reducer(initialState, action);

    expect(state.loading).toEqual(true);
  });

  it('Should populate items projects', () => {
    const response = <Pagination<Job>> {
      results: [],
      next: '0',
      previous: '0',
      count: '0'
    };

    const action = new actionJobs.LoadJobsSuccess(response);
    const state = fromJobs.reducer(initialState, action);

    expect(state.loading).toEqual(false);
    expect(state.ids.length).toEqual(response.results.length);
  });
});
