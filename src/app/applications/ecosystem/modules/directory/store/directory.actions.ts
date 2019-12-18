import { Action } from '@ngrx/store';
import { IFilter } from '@shared/components/filter/filter.component';
import { PaginationModel, ConsultantModel } from '@applications/shared/models';
import {OrderEnum} from '@applications/shared/enums';

export const FILTER = '[Directory] Filter';
export const FILTERS_SET = '[Directory] Filters set';
export const FILTERS_RESTORE = '[Directory] Restore filters';
export const SEARCH = '[Directory] Search';
export const SEARCH_SUCCESS = '[Directory] Search Success';
export const PAGINATE = '[Directory] Paginate';
export const LOAD_CONSULTANTS = '[Directory] Load Consultants';
export const SEARCH_TERMS = '[Directory] Set search terms';
export const SORT = '[Directory] Sort';
export const ORDER = '[Directory] Order';

export class Filter implements Action {
  readonly type = FILTER;
  constructor(public payload: any ) { }
}

export class FiltersSet implements Action {
  readonly type = FILTERS_SET;
  constructor(public payload: {filters: IFilter[], forceReset?: boolean}) { }
}

export class RestoreFilters implements Action {
  readonly type = FILTERS_RESTORE;
  constructor() { }
}
export class Paginate implements Action {
  readonly type = PAGINATE;
  constructor(public payload: {pageSize: number, pageIndex: number}) { }
}
export class SetSearchTerms implements Action {
  readonly type = SEARCH_TERMS;
  constructor(public payload: string) {}
}

export class Search implements Action {
  readonly type = SEARCH;
  constructor() { }
}

export class SearchSuccess implements Action {
  readonly type = SEARCH_SUCCESS;
  constructor(public payload: PaginationModel<ConsultantModel>) { }
}

export class LoadConsultants implements Action {
  readonly type = LOAD_CONSULTANTS;
  constructor(public payload: PaginationModel<ConsultantModel>) { }
}

export class Order implements Action {
  readonly type = ORDER;
  constructor(public payload: OrderEnum) { }
}
export class Sort implements Action {
  readonly type = SORT;
  constructor(public payload: string) { }
}


export type All
  = Filter
  | FiltersSet
  | RestoreFilters
  | Paginate
  | SetSearchTerms
  | Search
  | SearchSuccess
  | LoadConsultants
  | Sort
  | Order;

