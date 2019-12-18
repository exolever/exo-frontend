import { AppState } from '@core/store/reducers';
import { IFilter } from '@shared/components/filter/filter.component';
import {ConsultantModel } from '@applications/shared/models';
import { directoryConfig } from '../directory.conf';
import * as DirectoryActions from './directory.actions';
import {OrderEnum} from '@applications/shared/enums';


export interface DirectoryState {
  searchTerms: string;
  pageSize: number;
  page: number;
  sortBy: string;
  order: OrderEnum;
  filters: IFilter[];
  isLoading: boolean;
  consultants: ConsultantModel[];
  totalConsultants: number;
}

const initialState: DirectoryState = {
  searchTerms: '',
  pageSize: directoryConfig.pageSize,
  page: directoryConfig.initialPage,
  sortBy: directoryConfig.sortBy,
  order: directoryConfig.order,
  filters: [],
  isLoading: undefined,
  consultants: undefined,
  totalConsultants: undefined
};

export function reducer(state = initialState, action: DirectoryActions.All): DirectoryState {
  switch (action.type) {
    case DirectoryActions.FILTERS_SET:
      if (action.payload.forceReset) {
        state.filters = action.payload.filters;
      } else {
        action.payload.filters.forEach(filter => {
          const filterToUpdate = state.filters.find(f => f.slug === filter.slug);
          if (filterToUpdate) {
            filterToUpdate.options = filter.options;
          } else {
            state.filters.unshift(filter);
          }
        });
      }
      return {...state};
    case DirectoryActions.FILTER:
      const newFilters = state.filters.map( filter => {
          if (filter.slug === action.payload.name) {
            filter.options.forEach(opt => opt.selected = false);
            filter.dirty = false;
            action.payload.values.forEach(item => {
              const option = filter.options.find(opt => opt.pk === item);
              if (option) {
                option.selected = true;
                option.showByDefault = true;
                filter.dirty = true;
              }
            });
          }
          return filter;
        });

      return {
        ...state,
        page: 1, // Always a filter is applied we need to reset the current page.
        filters: newFilters
      };
    case DirectoryActions.FILTERS_RESTORE:
      state.filters.forEach(filter => {
        filter.dirty = false;
        filter.options = filter.options.map(opt => { opt.selected = false; return opt; });
      });
      return {
        ...state
      };
    case DirectoryActions.SEARCH:
      return {
        ...state,
        isLoading: true
      };
    case DirectoryActions.SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case DirectoryActions.SEARCH_TERMS:
      return {
        ...state,
        page: directoryConfig.initialPage,
        searchTerms: action.payload
      };
    case DirectoryActions.LOAD_CONSULTANTS:
      return {
        ...state,
        consultants: action.payload.results,
        totalConsultants: action.payload.count
      };
    case DirectoryActions.PAGINATE:
      return {
        ...state,
        page: action.payload.pageIndex,
        pageSize: action.payload.pageSize
      };
    case DirectoryActions.SORT:
      return {
        ...state,
        sortBy: action.payload,
        order: undefined,
        page: directoryConfig.initialPage
      };
    case DirectoryActions.ORDER:
      return {
        ...state,
        order: action.payload,
        page: directoryConfig.initialPage
      };
    default:
      return state;
  }
}

export function getFilters(state: AppState, key?: string) {
  const filters = state.directory.filters;
  return key ? filters[key] : filters;
}

export function getSelectedOptions(state: AppState) {
  return state.directory.filters.some(filter => filter.dirty);
}

export function getQueryParams(state: AppState) {
  return {
    searchTerms: state.directory.searchTerms,
    page: state.directory.page,
    pageSize: state.directory.pageSize,
    sortBy: state.directory.sortBy,
    order: state.directory.order,
    filters: state.directory.filters,
  };
}

export function getIsLoading(state: AppState) {
  return state.directory.isLoading;
}

export function getPage(state: AppState) {
  return state.directory.page;
}

export function getPageSize(state: AppState) {
  return state.directory.pageSize;
}

export function getSortBy(state: AppState) {
  return state.directory.sortBy;
}

export function getResults(state: AppState) {
  return state.directory.consultants;
}

export function getTotalResults(state: AppState) {
  return state.directory.totalConsultants;
}

export function getTerms(state: AppState) {
  return state.directory.searchTerms;
}
