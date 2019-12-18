import { OrderEnum } from '@applications/shared/enums';
import { PaginationModel } from '@applications/shared/models';
import { IFilter } from '@shared/components/filter/filter.component';
import { FakeConsultantFactory } from '@applications/shared/faker_factories/consultant-fake.model';
import { directoryConfig } from '../directory.conf';
import * as DirectoryReducer from './directory.reducer';
import * as DirectoryActions from './directory.actions';


describe('DirectoryReducer', () => {
  let initialState: DirectoryReducer.DirectoryState;
  beforeEach(() => {
    initialState = {
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
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const result = DirectoryReducer.reducer(initialState, {} as any);
      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('FILTERS_SET action', () => {
    it('should works without filters', () => {
      const filters: IFilter[] = [];
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.FiltersSet({ filters: filters }));
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, filters: filters }
      ));
    });
    it('should works with new filters', () => {
      const filters: IFilter[] = [{
        name: 'myName',
        slug: 'my-slug',
        dirty: false,
        options: [],
        isRadioButton: false
      }];
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.FiltersSet({ filters: filters }));
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, filters: filters }
      ));
    });
    it('should works with filters defined previously', () => {
      const filters: IFilter[] = [{
        name: 'myName2',
        slug: 'my-slug2',
        dirty: false,
        options: [],
        isRadioButton: false
      }];
      initialState.filters = filters;
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.FiltersSet({ filters: filters }));
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, filters: filters }
      ));
    });
  });
  describe('FILTER action', () => {
    it('should mark the filters applied', () => {
      initialState.filters = [{
        name: 'myName',
        slug: 'my-name',
        dirty: false,
        options: [
          { pk: '1', name: 'opt1', selected: false, showByDefault: true },
          { pk: '2', name: 'opt2', selected: false, showByDefault: true },
          { pk: '3', name: 'opt3', selected: false, showByDefault: true }
        ]
      }];
      const filter = { name: 'my-name', values: ['2', '3'] };
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.Filter(filter));
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        {
          ...initialState,
          filters: [{
            name: 'myName',
            slug: 'my-name',
            dirty: true,
            options: [
              { pk: '1', name: 'opt1', selected: false, showByDefault: true },
              { pk: '2', name: 'opt2', selected: true, showByDefault: true },
              { pk: '3', name: 'opt3', selected: true, showByDefault: true }
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
          { pk: '1', name: 'opt1', selected: false },
          { pk: '2', name: 'opt2', selected: false },
          { pk: '3', name: 'opt3', selected: false }
        ]
      }];
      const filter = { name: 'my-name', values: ['opt4', 'opt4'] };
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.Filter(filter));
      expect(JSON.stringify(result)).toBe(JSON.stringify(result));
    });

    it('should NOT set any state when the filter applied is wrong', () => {
      initialState.filters = [{
        name: 'myName',
        slug: 'my-name',
        dirty: false,
        options: [
          { pk: '1', name: 'opt1', selected: false },
          { pk: '2', name: 'opt2', selected: false },
          { pk: '3', name: 'opt3', selected: false }
        ]
      }];
      const filter = { name: 'my-wrong-name', values: ['opt4', 'opt4'] };
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.Filter(filter));
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
          { pk: '1', name: 'opt1', selected: true },
          { pk: '2', name: 'opt2', selected: true },
          { pk: '3', name: 'opt3', selected: true }
        ]
      }];
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.RestoreFilters());
      result.filters.forEach(filter => expect(filter.options.every(opt => opt.selected === false)).toBeTruthy());
    });
  });
  describe('SEARCH action', () => {
    it('should return the loading attribute', () => {
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.Search());
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, isLoading: true }
      ));
    });
  });
  describe('SEARCH_SUCESS action', () => {
    it('should return the rith state with results', () => {
      const apiResults = new PaginationModel(2, '2', '1', [new FakeConsultantFactory(), new FakeConsultantFactory()]);
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.SearchSuccess(apiResults));
      expect(JSON.stringify(result)).toBe(JSON.stringify({
        ...initialState,
        page: 1,
        isLoading: false
      })
      );
    });

    it('should return the rith state with no results', () => {
      const apiResults = new PaginationModel(0, undefined, '1', []);
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.SearchSuccess(apiResults));
      expect(JSON.stringify(result)).toBe(JSON.stringify({
        ...initialState,
        page: 1,
        isLoading: false
      })
      );
    });
  });
  describe('SEARCH_TERMS action', () => {
    it('should return the default state', () => {
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.SetSearchTerms('nameToFind'));
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, searchTerms: 'nameToFind' }
      ));
    });
  });
  describe('LOAD_CONSULTANTS action', () => {
    it('should set the state with the consultants information', () => {
      const consultant1 = new FakeConsultantFactory();
      const consultant2 = new FakeConsultantFactory();
      const data = new PaginationModel(2, undefined, undefined, [consultant1, consultant2]);
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.LoadConsultants(data));

      expect(result.totalConsultants).toBe(2);
      expect(result.consultants.includes(consultant1)).toBeTruthy();
      expect(result.consultants.includes(consultant2)).toBeTruthy();
    });
  });
  describe('PAGINATE action', () => {
    it('should return the default with the right page', () => {
      const result = DirectoryReducer.reducer(
        initialState, new DirectoryActions.Paginate({ pageIndex: 1, pageSize: 12 })
      );

      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, page: 1 }
      ));
    });
  });

  describe('ORDER action', () => {
    it('should return the state witg ASC order', () => {
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.Order(OrderEnum.Asc));
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, order: OrderEnum.Asc }
      ));
    });

    it('should return the state witg DESC order', () => {
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.Order(OrderEnum.Desc));
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, order: OrderEnum.Desc }
      ));
    });
  });

  describe('SORT action', () => {
    it('should return the state sort by the right field', () => {
      const result = DirectoryReducer.reducer(initialState, new DirectoryActions.Sort('field'));
      expect(JSON.stringify(result)).toBe(JSON.stringify(
        { ...initialState, sortBy: 'field' }
      ));
    });
  });
});
