import { AppState } from '@core/store/reducers';
import { ActionReducerMap } from '@ngrx/store';

import * as fromSearch from './search/search.reducer';
import * as fromCRUD from './crud/crud.reducer';
import {OrderEnum} from '@applications/shared/enums';

export const reducers: ActionReducerMap<MediaLibraryState> = {
  search: fromSearch.reducer,
  crud: fromCRUD.reducer
};

export interface MediaLibraryState {
  search: fromSearch.SearchState;
  crud: fromCRUD.CrudState;
}

/**
 * Pure function to access to the state. For accesing to the state,
 * use always a function from this set.
 */

export function selectTerms(state: AppState) {
  return state.mediaLibrary.search.searchTerms;
}

export function selectResults(state: AppState) {
  return state.mediaLibrary.crud.resources;
}

export function selectIsLoading(state: AppState) {
  return state.mediaLibrary.search.isLoading;
}

export function selectResultsCount(state: AppState) {
  return state.mediaLibrary.crud.resourcesCount;
}

export function selectPage(state: AppState) {
  return state.mediaLibrary.search.page - 1;
}

export function selectFilters(state: AppState, key?: string) {
  return key ? state.mediaLibrary.search.filters[key] : state.mediaLibrary.search.filters;
}

export function selectSelectedOptions(state: AppState) {
  return state.mediaLibrary.search.filters.some(filter => filter.dirty);
}

export function selectSortBy(state: AppState) {
  return state.mediaLibrary.search.sortBy;
}

export function selectOrder(state: AppState) {
  return state.mediaLibrary.search.order;
}

export function selectPageSize(state: AppState) {
  return state.mediaLibrary.search.pageSize;
}

export function selectOrderByAndSortValue(state: AppState) {
  const ordering = state.mediaLibrary.search.order === OrderEnum.Asc ? 'asc' : 'desc';
  return state.mediaLibrary.search.sortBy + '-' + ordering;
}

export function selectQueryParams(state: AppState) {
  return {
    searchTerms: state.mediaLibrary.search.searchTerms,
    page: state.mediaLibrary.search.page,
    pageSize: state.mediaLibrary.search.pageSize,
    sortBy: state.mediaLibrary.search.sortBy,
    order: state.mediaLibrary.search.order,
    filters: state.mediaLibrary.search.filters,
    sections: state.mediaLibrary.search.sections,
    projectsUUID: state.mediaLibrary.search.projectsUUID
  };
}
