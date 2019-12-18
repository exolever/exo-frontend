import { Action } from '@ngrx/store';
import { Resource } from '../resource.model';
import { PaginationModel } from '@applications/shared/models';
import { OrderEnum } from '@applications/shared/enums';
import { IFilter } from '@shared/components/filter/filter.component';

export const SEARCH = '[MediaLibrary] Search';
export const SEARCH_SUCCESS = '[MediaLibrary] Search Success';
export const SORT = '[MediaLibrary] Sort';
export const ORDER = '[MediaLibrary] Order';
export const FILTER = '[MediaLibrary] Filter';
export const FILTERS_SET = '[MediaLibrary] Filters set';
export const FILTERS_GET = '[MediaLibrary] Filters get';
export const PAGINATE = '[MediaLibrary] Paginate';
export const SEARCH_TERMS = '[MediaLibrary] Set search terms';
export const FILTERS_RESTORE = '[MediaLibrary] Restore filters';
export const ADD_RESOURCE = '[MediaLibrary] Add resource';
export const SECTIONS_FIELDS = '[MediaLibrary] Sections fields';
export const PROJECTS_UUID = '[MediaLibrary] Projects UUID';

export class Order implements Action {
  readonly type = ORDER;
  constructor(public payload: OrderEnum) { }
}
export class Sort implements Action {
  readonly type = SORT;
  constructor(public payload: string) { }
}

export class Filter implements Action {
  readonly type = FILTER;
  constructor(public payload: any ) { }
}

export class Paginate implements Action {
  readonly type = PAGINATE;
  constructor(public payload: {pageSize: string, pageIndex: string}) { }

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
  constructor(public payload: PaginationModel<Resource>) { }
}

export class FiltersSet implements Action {
  readonly type = FILTERS_SET;
  constructor(public payload: {filters: IFilter[], forceReset?: boolean}) { }
}

export class FiltersGet implements Action {
  readonly type = FILTERS_GET;
  constructor() { }
}

export class SectionsFields implements Action {
  readonly type = SECTIONS_FIELDS;
  constructor(public payload: {sections: string[]}) { }
}

export class ProjectsUUID implements Action {
  readonly type = PROJECTS_UUID;
  constructor(public payload: { projectsUUID: string }) {}
}

export class RestoreFilters implements Action {
  readonly type = FILTERS_RESTORE;
  constructor() { }
}

export type All
  = Sort
  | Order
  | Filter
  | FiltersSet
  | RestoreFilters
  | Paginate
  | SetSearchTerms
  | Search
  | SearchSuccess
  | SectionsFields
  | ProjectsUUID;
