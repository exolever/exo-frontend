import * as actionsProjects from '../action/projects.action';
import { FakeGenericProjectFactory } from '../../models/project-fake.model';
import { ProjectsState } from './projects.reducer';
import * as fromProjects from './projects.reducer';

describe('ProjectsReducer', () => {
  let projects = [];
  let initialState: ProjectsState;
  const project = new FakeGenericProjectFactory();

  beforeEach(() => {
    projects = [project];
    initialState = {
      ids: [],
      entities: {},
      loading: false,
      loaded: false,
      count: undefined,
      pkSelected: undefined,
      pageSize: 15,
      pageIndex: 1,
      searchBy: '',
      sortBy: 'date'
    };
  });

  it('Should return the default state', () => {
    const action = { } as any;
    const state = fromProjects.reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('Should set the load config', () => {
    const action = new actionsProjects.Load();
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      loaded: false,
      pageIndex: 1,
      pageSize: 15,
      pkSelected: undefined
    });
  });

  it('Should load projects', () => {
    const action = new actionsProjects.LoadSuccess({
      previous: undefined,
      next: undefined,
      count: '1',
      results: projects
     });
    const state = fromProjects.reducer(initialState, action);
    expect(Object.values(state.entities)).toEqual(projects);
  });

  it('Should set loading a true with SEARCH', () => {
    const value = 'search by ...';
    const action = new actionsProjects.SetSearch(value);
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, searchBy: value});
  });

  it('Should set loading a false with LOAD_FAIL', () => {
    const action = new actionsProjects.LoadFail({});
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_FAIL', () => {
    const action = new actionsProjects.CreateFail({});
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with EDIT_FAIL', () => {
    const action = new actionsProjects.EditFail({});
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with DELETE_FAIL', () => {
    const action = new actionsProjects.DeleteFail({});
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a true with CREATE', () => {
    const action = new actionsProjects.Create(new FakeGenericProjectFactory());
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with EDIT', () => {
    const action = new actionsProjects.Edit(new FakeGenericProjectFactory());
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with DELETE', () => {
    const action = new actionsProjects.Delete(new FakeGenericProjectFactory());
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with LOAD_DETAIL', () => {
    const action = new actionsProjects.LoadDetails(1);
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with CREATE_SUCCESS', () => {
    const action = new actionsProjects.CreateSuccess(new FakeGenericProjectFactory());
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false, count: state.count + 1});
  });

  it('Should set loading a true with EDIT_SUCCESS', () => {
    const payload = {
      results: [project],
      count: '1',
      next: undefined,
      previous: undefined
    };
    const loadAction = new actionsProjects.LoadSuccess(payload);
    const oldState = fromProjects.reducer(initialState, loadAction);
    project.name = 'new title';
    const editAction = new actionsProjects.EditSuccess(project);
    const state = fromProjects.reducer(oldState, editAction);
    expect(state).toEqual({...state, pkSelected: project.pk, loading: false});
    expect(state.entities[project.pk].name).toEqual(project.name);
  });

  it('Should set loading a true with LOAD_DETAIL_SUCCESS', () => {
    const action = new actionsProjects.LoadDetailsSuccess(project);
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, pkSelected: project.pk, loading: false});
  });

  it('Should set loading a true with DELETE_SUCCESS', () => {
    const payload = {
      results: [project],
      count: '1',
      next: undefined,
      previous: undefined
    };
    const loadAction = new actionsProjects.LoadSuccess(payload);
    const oldState = fromProjects.reducer(initialState, loadAction);
    const deleteAction = new actionsProjects.DeleteSuccess(project.pk);
    const newState = fromProjects.reducer(oldState, deleteAction);
    expect(newState).toEqual({...newState, count: 0, loading: false});
  });

  it('Should set loading a true with RESTORE', () => {
    const action = new actionsProjects.RestoreState();
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, searchBy: initialState.searchBy, pageSize: initialState.pageSize});
  });

  it('Should set loading a true with SET_PAGINATION', () => {
    const payload = {pageIndex: 1, pageSize: 10};
    const action = new actionsProjects.SetPagination(payload);
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, pageIndex: payload.pageIndex, pageSize: payload.pageSize});
  });

  it('Should set loading a true with SORT_BY', () => {
    const payload = 'date';
    const action = new actionsProjects.SortBy(payload);
    const state = fromProjects.reducer(initialState, action);
    expect(state).toEqual({...state, sortBy: payload});
  });
});
