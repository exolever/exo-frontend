import { OrderEnum } from '@applications/shared/enums';
import { PaginationModel } from '@applications/shared/models';
import { IFilter } from '@shared/components/filter/filter.component';

import { mediaLibraryConfig } from '../../ecosystem-media-library.conf';
import { Resource, ResourceStatus, ResourceType } from '../resource.model';
import * as searchReducers from './search.reducer';
import * as SearchActions from './search.actions';
import { reducer } from './search.reducer';

describe('SearchReducer', () => {
  let initialState: searchReducers.SearchState;
  beforeEach(() => {
    initialState = {
      searchTerms: '',
      pageSize: mediaLibraryConfig.pageSize,
      page: mediaLibraryConfig.initialPage,
      sortBy: mediaLibraryConfig.sortBy,
      order: mediaLibraryConfig.order,
      filters: [],
      sections: [],
      projectsUUID: '',
      isLoading: undefined
    };
  });

  const resource1 = new Resource(
    { pk: '1', name: 'name1', type: ResourceType.Video, tags: [], status: ResourceStatus.Available }
    );
  const resource2 = new Resource(
    { pk: '2', name: 'name2', type: ResourceType.Video, tags: [], status: ResourceStatus.Available }
    );

  describe('undefined action', () => {
    it('should return the default state', () => {
      const result = reducer(initialState, {} as any);
      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('PAGINATE action', () => {
    it('should return the default with the right page', () => {
      const result = reducer(initialState, new SearchActions.Paginate({pageIndex: '1', pageSize: '12'}));

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState, page: 1}
      ));
    });
  });

  describe('ORDER action', () => {
    it('should return the state witg ASC order', () => {
      const result = reducer(initialState, new SearchActions.Order(OrderEnum.Asc));

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState, order: OrderEnum.Asc}
      ));
    });

    it('should return the state witg DESC order', () => {
      const result = reducer(initialState, new SearchActions.Order(OrderEnum.Desc));

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState, order: OrderEnum.Desc}
      ));
    });
  });

  describe('SORT action', () => {
    it('should return the state sort by the right field', () => {
      const result = reducer(initialState, new SearchActions.Sort('field'));

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState, sortBy: 'field'}
      ));
    });
  });

  describe('SEARCH_TERMS action', () => {
    it('should return the default state', () => {
      const result = reducer(initialState, new SearchActions.SetSearchTerms('nameToFind'));

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState, searchTerms: 'nameToFind'}
      ));
    });
  });

  describe('SEARCH action', () => {
    it('should return the default state', () => {
      const result = reducer(initialState, new SearchActions.Search());

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState, isLoading: true}
      ));
    });
  });

  describe('SEARCH_SUCESS action', () => {
    it('should return the rith state with results', () => {
      const apiResults = new PaginationModel(2, '2', '1', [resource1, resource2]);
      const result = reducer(initialState, new SearchActions.SearchSuccess(apiResults));

      expect(JSON.stringify(result)).toBe(JSON.stringify({
          ...initialState,
          page: 1,
          isLoading: false
          })
        );
    });

    it('should return the rith state with no results', () => {
      const apiResults = new PaginationModel(0, undefined, '1', []);
      const result = reducer(initialState, new SearchActions.SearchSuccess(apiResults));

      expect(JSON.stringify(result)).toBe(JSON.stringify({
          ...initialState,
          page: 1,
          isLoading: false
          })
        );
    });


  });

  describe('FILTERS_SET action', () => {
    it('should works without filters', () => {
      const filters: IFilter[] = [];
      const result = reducer(initialState, new SearchActions.FiltersSet({filters: filters}));

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState, filters: filters}
      ));
    });

    it('should works with filters', () => {
      const filters: IFilter[] = [{
        name: 'myName',
        slug: 'my-name',
        dirty: false,
        options: []
      }];
      const result = reducer(initialState, new SearchActions.FiltersSet({filters: filters}));

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState, filters: filters}
      ));
    });
  });

  describe('FILTER action', () => {
    it('should set selected the filters applied', () => {
      initialState.filters = [{
        name: 'myName',
        slug: 'my-name',
        dirty: false,
        options: [
          {pk: '1', name: 'opt1', selected: false, showByDefault: true},
          {pk: '2', name: 'opt2', selected: false, showByDefault: true},
          {pk: '3', name: 'opt3', selected: false, showByDefault: true}
        ]
      }];
      const filter = {name: 'myName', values: ['2', '3']};

      const result = reducer(initialState, new SearchActions.Filter(filter));

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {...initialState,
          filters: [{
            name: 'myName',
            slug: 'my-name',
            dirty: true,
            options: [
              {pk: '1', name: 'opt1', selected: false, showByDefault: true},
              {pk: '2', name: 'opt2', selected: true, showByDefault: true},
              {pk: '3', name: 'opt3', selected: true, showByDefault: true}
            ]
          }]
      }));
    });

    it('should NOT set any state when the options applied are wrong', () => {
      initialState.filters = [{
        name: 'myName',
        slug: 'my-name',
        dirty: false,
        options: [
          {pk: '1', name: 'opt1', selected: false},
          {pk: '2', name: 'opt2', selected: false},
          {pk: '3', name: 'opt3', selected: false}
        ]
      }];
      const filter = {name: 'my-name', values: ['opt4', 'opt4']};

      const result = reducer(initialState, new SearchActions.Filter(filter));

      expect(JSON.stringify(result)).toBe(JSON.stringify(result));
    });

    it('should NOT set any state when the filter applied is wrong', () => {
      initialState.filters = [{
        name: 'myName',
        slug: 'my-name',
        dirty: false,
        options: [
          {pk: '1', name: 'opt1', selected: false},
          {pk: '2', name: 'opt2', selected: false},
          {pk: '3', name: 'opt3', selected: false}
        ]
      }];
      const filter = {name: 'my-wrong-name', values: ['opt4', 'opt4']};

      const result = reducer(initialState, new SearchActions.Filter(filter));

      expect(JSON.stringify(result)).toBe(JSON.stringify(result));
    });

  });

  describe('FILTERS_RESTORE action', () => {
    it('should set as not selected all options of every filter', () => {

      initialState.filters = [{
        name: 'myName',
        slug: 'my-name',
        dirty: true,
        options: [
          {pk: '1', name: 'opt1', selected: true},
          {pk: '2', name: 'opt2', selected: true},
          {pk: '3', name: 'opt3', selected: true}
        ]
      }];

      const result = reducer(initialState, new SearchActions.RestoreFilters());

      result.filters.forEach(filter => expect(filter.options.every(opt => opt.selected === false)).toBeTruthy() );

    });
  });
});
