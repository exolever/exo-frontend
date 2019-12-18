import * as teamActions from '../action/team.action';
import { FakeTeamFactory } from '../../models/team-fake.model';
import { TeamsState } from './teams.reducer';
import * as fromTeams from './teams.reducer';

describe('TeamsReducer', () => {
  let teams = [];
  let initialState: TeamsState;

  beforeEach(() => {
    teams = [new FakeTeamFactory()];
    initialState = {
      ids: [],
      entities: {},
      loading: false,
      loaded: false
    };
  });

  it('Should return the default state', () => {
    const action = { } as any;
    const state = fromTeams.reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('Should set the load config', () => {
    const action = new teamActions.Load(1);
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      loaded: false
    });
  });

  it('Should load teams', () => {
    const action = new teamActions.LoadSuccess(teams);
    const state = fromTeams.reducer(initialState, action);
    expect(Object.values(state.entities)).toEqual(teams);
  });

  it('Should set loading a false with LOAD_FAIL', () => {
    const action = new teamActions.LoadFail({});
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with EDIT_FAIL', () => {
    const action = new teamActions.EditFail({});
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_FAIL', () => {
    const action = new teamActions.CreateFail({});
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with DELETE_FAIL', () => {
    const action = new teamActions.DeleteFail({});
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a true with CREATE', () => {
    const action = new teamActions.Create({team: new FakeTeamFactory(), projectPk: 1});
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with EDIT', () => {
    const payload = {team: new FakeTeamFactory(), projectPk: 1};
    const action = new teamActions.Edit(payload);
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with DELETE', () => {
    const payload = {team: new FakeTeamFactory(), projectPk: 1};
    const action = new teamActions.Delete(payload);
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with LOAD_DETAIL', () => {
    const action = new teamActions.LoadDetails(1);
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with CREATE_SUCCESS', () => {
    const team = new FakeTeamFactory();
    const action = new teamActions.CreateSuccess(team);
    const state = fromTeams.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
    expect(state.entities[team.pk].name).toEqual(team.name);
  });

  it('Should set loading a true with EDIT_SUCCESS', () => {
    const team = new FakeTeamFactory();
    const loadAction = new teamActions.LoadSuccess([team]);
    const oldState = fromTeams.reducer(initialState, loadAction);
    team.name = 'new name';
    const editAction = new teamActions.EditSuccess(team);
    const newState = fromTeams.reducer(oldState, editAction);
    expect(newState).toEqual({...newState, loading: false});
    expect(newState.entities[team.pk].name).toEqual(team.name);
  });

  it('Should set loading a true with LOAD_DETAIL_SUCCESS', () => {
    const team = new FakeTeamFactory();
    const loadAction = new teamActions.LoadSuccess([team]);
    const oldState = fromTeams.reducer(initialState, loadAction);
    team.name = 'new name';
    const loadDetailAction = new teamActions.LoadDetailsSuccess(team);
    const newState = fromTeams.reducer(oldState, loadDetailAction);
    expect(newState).toEqual({...newState, loading: false});
    expect(newState.entities[team.pk].name).toEqual(team.name);
  });

  it('Should set loading a true with DELETE_SUCCESS', () => {
    const team = new FakeTeamFactory();
    const loadAction = new teamActions.LoadSuccess([team]);
    const oldState = fromTeams.reducer(initialState, loadAction);
    expect(oldState.entities[team.pk]).toBeDefined();
    const deleteAction = new teamActions.DeleteSuccess(team.pk);
    const newState = fromTeams.reducer(oldState, deleteAction);
    expect(newState).toEqual({...newState, loading: false});
    expect(newState.entities[team.pk]).toBeUndefined();
  });

});
