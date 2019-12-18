import { OrderEnum } from '@applications/shared/enums/';
import { IFilter } from '@shared/components/filter/filter.component';

import { mediaLibraryConfig } from '../../ecosystem-media-library.conf';
import * as SearchActions from './search.actions';

export interface SearchState {
  searchTerms: string;
  sections: Array<string>;
  projectsUUID: string;
  page: number;
  pageSize: number;
  sortBy: string;
  order: OrderEnum;
  filters: IFilter[];
  isLoading: boolean;
}

const staticFilter = {
  name: 'status',
  slug: 'status',
  isRadioButton: true,
  dirty: false,
  options: [
    {name: 'All', pk: 'status', selected: true, showByDefault: true},
    {name: 'Pending', pk: 'D', selected: false, showByDefault: true},
    {name: 'Available', pk: 'A', selected: false, showByDefault: true}
  ]
};

const initialState: SearchState = {
  searchTerms: '',
  sections: [],
  projectsUUID: '',
  pageSize: mediaLibraryConfig.pageSize,
  page: mediaLibraryConfig.initialPage,
  sortBy: mediaLibraryConfig.sortBy,
  order: mediaLibraryConfig.order,
  filters: [JSON.parse(JSON.stringify(staticFilter))],
  isLoading: undefined
};

export function reducer(state = initialState, action: SearchActions.All): SearchState {
  switch (action.type) {
    case SearchActions.PAGINATE:
      return {
        ...state,
        page: +action.payload.pageIndex,
        pageSize: +action.payload.pageSize
      };
    case SearchActions.SORT:
      return {
        ...state,
        sortBy: action.payload,
        order: undefined,
        page: mediaLibraryConfig.initialPage
      };
    case SearchActions.ORDER:
      return {
        ...state,
        order: action.payload,
        page: mediaLibraryConfig.initialPage
      };
    case SearchActions.SEARCH_TERMS:
      return {
        ...state,
        page: mediaLibraryConfig.initialPage,
        searchTerms: action.payload
      };
    case SearchActions.SEARCH:
      return {
        ...state,
        isLoading: true
      };
    case SearchActions.SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case SearchActions.SECTIONS_FIELDS:
      return {
        ...state,
        sections: action.payload.sections,
      };
    case SearchActions.PROJECTS_UUID:
      return {
        ...state,
        projectsUUID: action.payload.projectsUUID,
      };
    case SearchActions.FILTERS_SET:
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
      return {
        ...state,
        page: mediaLibraryConfig.initialPage
      };
    case SearchActions.FILTER: // TODO --> refactorize when filter component will be done with @ngrx/Store
      const newFilters = state.filters.map( filter => {
          if (filter.name === action.payload.name) {
            filter.options.forEach(opt => opt.selected = false);
            filter.dirty = false;
            action.payload.values.forEach(item => {
              const option = filter.options.find(opt => opt.pk === item);
              option.selected = true;
              option.showByDefault = true;
              filter.dirty = true;
            });
          }
          return filter;
        });

      return {
        ...state,
        filters: newFilters,
        page: mediaLibraryConfig.initialPage
      };
    case SearchActions.FILTERS_RESTORE:
      state.filters.forEach(filter => {
        filter.dirty = false;
        filter.options = filter.slug === staticFilter.slug ?
          staticFilter.options.map(opt => JSON.parse(JSON.stringify(opt))) :
          filter.options.map(opt => { opt.selected = false; return opt; });
      });
      return {
        ...state,
        page: mediaLibraryConfig.initialPage
      };
    default:
      return state;
  }
}
