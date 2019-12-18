import { Action } from '@ngrx/store';
import { Job } from '../models/job.model';
import { Pagination } from '@core/interfaces/pagination.interface';

export enum MyJobsActionEnum {
  LOAD_JOBS =         '[Jobs] Load jobs',
  LOAD_JOBS_SUCCESS = '[Jobs] Load jobs success',
  LOAD_JOBS_FAIL =    '[Jobs] Load jobs fail',
  SEARCH =            '[Jobs] Search',
  SET_PAGINATION =    '[Jobs] set pagination'
}

export class LoadJobs implements Action {
  readonly type = MyJobsActionEnum.LOAD_JOBS;
}

export class LoadJobsSuccess implements Action {
  readonly type = MyJobsActionEnum.LOAD_JOBS_SUCCESS;
  constructor(public payload: Pagination<Job>) { }
}

export class LoadJobsFail implements Action {
  readonly type = MyJobsActionEnum.LOAD_JOBS_FAIL;
  constructor(public payload: any) { }
}

export class SetSearch implements Action {
  readonly type = MyJobsActionEnum.SEARCH;
  constructor(public payload: {searchBy: string}) {}
}

export class SetPagination implements Action {
  readonly type = MyJobsActionEnum.SET_PAGINATION;
  constructor(public payload: {pageIndex: number; pageSize: number}) {}
}

export type All
  = LoadJobs
  | LoadJobsSuccess
  | LoadJobsFail
  | SetSearch
  | SetPagination;
