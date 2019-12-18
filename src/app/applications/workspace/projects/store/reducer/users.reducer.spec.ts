import { FakeProjectMemberFactory } from '../../models/project-member-fake.model';
import * as actionsUsers from '../action/user.action';
import { UsersState } from './users.reducer';
import * as fromUsers from './users.reducer';

describe('UsersReducer', () => {
  let users = [];
  let initialState: UsersState;
  const member = new FakeProjectMemberFactory();

  beforeEach(() => {
    users = [member];
    initialState = {
      ids: [],
      entities: {},
      loading: false,
      loaded: false,
      count: undefined,
      pkSelected: undefined,
      pageSize: 15,
      pageIndex: 1,
      searchBy: ''
    };
  });

  it('Should return the default state', () => {
    const action = { } as any;
    const state = fromUsers.reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('Should set the load config', () => {
    const action = new actionsUsers.Load(1);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      loaded: false,
      pageIndex: 1,
      pageSize: 15,
      pkSelected: undefined
    });
  });

  it('Should load users', () => {
    const action = new actionsUsers.LoadSuccess({
      previous: undefined,
      next: undefined,
      count: '1',
      results: users
     });
    const state = fromUsers.reducer(initialState, action);
    expect(Object.values(state.entities)).toEqual(users);
    expect(state).toEqual({...state, loading: false, loaded: true});
    expect(state).toEqual({...state, count: users.length});
  });

  it('Should set loading a false with LOAD_FAIL', () => {
    const action = new actionsUsers.LoadFail({});
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_COLLABORATOR_FAIL', () => {
    const action = new actionsUsers.CreateCollaboratorFail({});
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with EDIT_COLLABORATOR_FAIL', () => {
    const action = new actionsUsers.EditCollaboratorFail({});
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_PARTICIPANT_FAIL', () => {
    const action = new actionsUsers.CreateParticipantFail({});
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with EDIT_PARTICIPANT_FAIL', () => {
    const action = new actionsUsers.EditParticipantFail({});
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with DELETE_FAIL', () => {
    const action = new actionsUsers.DeleteFail({});
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_COLLABORATOR', () => {
    const payload = {
      data: { projectRoles: [1, 2], teams: [1] },
      projectPk: 1
    };
    const action = new actionsUsers.CreateCollaborator(payload);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a false with EDIT_COLLABORATOR', () => {
    const payload = {
      data: { projectRoles: [1, 2], teams: [1] },
      projectPk: 1,
      userUuid: 'XXXX'
    };
    const action = new actionsUsers.EditCollaborator(payload);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a false with CREATE_PARTICIPANT', () => {
    const payload = {
      data: { name: 'kate', email: 'kate@example.com', teams: [1] },
      projectPk: 1
    };
    const action = new actionsUsers.CreateParticipant(payload);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a false with EDIT_PARTICIPANT', () => {
    const payload = {
      data: { name: 'kate', email: 'kate@example.com', teams: [1] },
      projectPk: 1,
      userUuid: 'XXXX'
    };
    const action = new actionsUsers.EditParticipant(payload);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a false with DELETE', () => {
    const payload = {
      projectPk: 1,
      member: new FakeProjectMemberFactory()
    };
    const action = new actionsUsers.Delete(payload);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a false with LOAD_DETAIL', () => {
    const action = new actionsUsers.LoadDetails(1);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with CREATE_COLLABORATOR_SUCCESS', () => {
    const action = new actionsUsers.CreateCollaboratorSuccess(new FakeProjectMemberFactory());
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false, count: state.count + 1});
  });

  it('Should set loading a true with CREATE_PARTICIPANT_SUCCESS', () => {
    const action = new actionsUsers.CreateParticipantSuccess(new FakeProjectMemberFactory());
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false, count: state.count + 1});
  });

  it('Should set loading a true with EDIT_COLLABORATOR_SUCCESS', () => {
    const payload = {
      results: [member],
      count: '1',
      next: undefined,
      previous: undefined
    };
    const loadAction = new actionsUsers.LoadSuccess(payload);
    const oldState = fromUsers.reducer(initialState, loadAction);
    member.user.shortName = 'new name';
    const editAction = new actionsUsers.EditCollaboratorSuccess(member);
    const state = fromUsers.reducer(oldState, editAction);
    expect(state).toEqual({...state, pkSelected: member.pk, loading: false});
    expect(state.entities[member.user.uuid].user.shortName).toEqual(member.user.shortName);
  });

  it('Should set loading a true with EDIT_PARTICIPANT_SUCCESS', () => {
    const payload = {
      results: [member],
      count: '1',
      next: undefined,
      previous: undefined
    };
    const loadAction = new actionsUsers.LoadSuccess(payload);
    const oldState = fromUsers.reducer(initialState, loadAction);
    member.user.shortName = 'new name2';
    const editAction = new actionsUsers.EditParticipantSuccess(member);
    const state = fromUsers.reducer(oldState, editAction);
    expect(state).toEqual({...state, pkSelected: member.pk, loading: false});
    expect(state.entities[member.user.uuid].user.shortName).toEqual(member.user.shortName);
  });

  it('Should set loading a true with EDIT_PARTICIPANT_TEAMS_SUCCESS', () => {
    const payload = {
      results: [member],
      count: '1',
      next: undefined,
      previous: undefined
    };
    const loadAction = new actionsUsers.LoadSuccess(payload);
    const oldState = fromUsers.reducer(initialState, loadAction);
    member.user.shortName = 'new name3';
    const editAction = new actionsUsers.EditParticipantTeamsSuccess(member);
    const state = fromUsers.reducer(oldState, editAction);
    expect(state).toEqual({...state, pkSelected: member.pk, loading: false});
    expect(state.entities[member.user.uuid].user.shortName).toEqual(member.user.shortName);
  });

  it('Should set loading a true with LOAD_DETAIL_SUCCESS', () => {
    const payload = {
      results: [member],
      count: '1',
      next: undefined,
      previous: undefined
    };
    const loadAction = new actionsUsers.LoadSuccess(payload);
    const oldState = fromUsers.reducer(initialState, loadAction);
    member.user.shortName = 'new name4';
    const loadDetailAction = new actionsUsers.LoadDetailsSuccess(member);
    const state = fromUsers.reducer(oldState, loadDetailAction);
    expect(state).toEqual({...state, pkSelected: member.pk, loading: false});
    expect(state.entities[member.user.uuid].user.shortName).toEqual(member.user.shortName);
  });

  it('Should set loading a true with DELETE_SUCCESS', () => {
    const payload = {
      results: [member],
      count: '1',
      next: undefined,
      previous: undefined
    };
    const loadAction = new actionsUsers.LoadSuccess(payload);
    const oldState = fromUsers.reducer(initialState, loadAction);
    const deleteAction = new actionsUsers.DeleteSuccess(member.user.uuid);
    const newState = fromUsers.reducer(oldState, deleteAction);
    expect(newState).toEqual({...newState, count: 0, loading: false});
  });

  it('Should set loading a true with SET_PAGINATION', () => {
    const payload = {pageIndex: 1, pageSize: 10, projectPk: 1};
    const action = new actionsUsers.SetPagination(payload);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, pageIndex: payload.pageIndex, pageSize: payload.pageSize});
  });

  it('Should set loading a true with SEARCH', () => {
    const payload = {searchBy: 'Search by ....', projectPk: 1};
    const action = new actionsUsers.SetSearch(payload);
    const state = fromUsers.reducer(initialState, action);
    expect(state).toEqual({...state, searchBy: payload.searchBy});
  });
});
