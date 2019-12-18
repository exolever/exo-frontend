import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as MyJobsAction from './my-jobs.action';
import { Job } from '../models/job.model';


export interface MyJobsState extends EntityState<Job> {
  loading: boolean;
  pageIndex: number;
  count: number | undefined;
  pageSize: number;
  searchBy: string;
}

export const jobsAdapter: EntityAdapter<Job> = createEntityAdapter<Job>({
  selectId: (job: Job) => job.pk
});


export const initialState: MyJobsState = jobsAdapter.getInitialState({
  loading: false,
  pageIndex: 1,
  count: undefined,
  pageSize: 15,
  searchBy: ''
});


export function reducer(state: MyJobsState = initialState, action: MyJobsAction.All): MyJobsState {
  switch (action.type) {
    case MyJobsAction.MyJobsActionEnum.LOAD_JOBS:
      return {...state,
        loading: true
      };

    case MyJobsAction.MyJobsActionEnum.LOAD_JOBS_SUCCESS:
      return jobsAdapter.addAll(<Job[]>action.payload.results, {
        ... state,
        count: +action.payload.count,
        loading: false
      });

    case MyJobsAction.MyJobsActionEnum.LOAD_JOBS_FAIL:
      return { ...state, loading: false };

    case MyJobsAction.MyJobsActionEnum.SEARCH:
        return {...state, searchBy: action.payload.searchBy };

    case MyJobsAction.MyJobsActionEnum.SET_PAGINATION:
        return {... state, pageIndex: action.payload.pageIndex, pageSize: action.payload.pageSize};

    default:
      return state;
  }
}

const selectJobsState = createFeatureSelector<MyJobsState>('jobs');

// get the selectors
const {
  selectAll,
} = jobsAdapter.getSelectors();
const selectEmptyMoment = (state: MyJobsState) => !state.loading && state.count === 0;
const selectLoading = (state: MyJobsState) => state.loading;
const selectCount = (state: MyJobsState) => state.count;
const selectPageSize = (state: MyJobsState) => state.pageSize;
const selectPageIndex = (state: MyJobsState) => state.pageIndex;
const selectSearchBy = (state: MyJobsState) => state.searchBy;

export const selectAllJobs = createSelector(selectJobsState, selectAll);
export const jobsEmptyMoment = createSelector(selectJobsState, selectEmptyMoment);
export const jobsAreLoading = createSelector(selectJobsState, selectLoading);
export const selectCountJobs = createSelector(selectJobsState, selectCount);
export const selectPageSizejobs = createSelector(selectJobsState, selectPageSize);
export const selectPageIndexjobs = createSelector(selectJobsState, selectPageIndex);
export const selectSearchByJobs = createSelector(selectJobsState, selectSearchBy);
