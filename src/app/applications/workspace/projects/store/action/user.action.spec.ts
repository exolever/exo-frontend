
import { FakeProjectMemberFactory } from '../../models/project-member-fake.model';
import * as userActions from './user.action';


describe('Workspace -> User Actions', () => {
  it('Should create a Load action', () => {
    const payload = 1;
    const action = new userActions.Load(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.LOAD,
      payload: payload
    });
  });

  it('Should create a LoadSuccess action', () => {
    const payload = {
      results: [new FakeProjectMemberFactory()],
      count: '1',
      next: undefined,
      previous: undefined
    };

    const action = new userActions.LoadSuccess(payload);

    expect( { ...action }).toEqual({
      type: userActions.TypeActionEnum.LOAD_SUCCESS,
      payload: payload
    });
  });

  it('Should create a LoadFail action', () => {
    const action = new userActions.LoadFail({});

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.LOAD_FAIL,
      payload: {}
    });
  });

  it('Should create a LoadDetail action', () => {
    const payload = 1;
    const action = new userActions.LoadDetails(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.LOAD_DETAIL,
      payload: payload
    });
  });

  it('Should create a LoadDetailsSuccess action', () => {
    const payload = new FakeProjectMemberFactory();
    const action = new userActions.LoadDetailsSuccess(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.LOAD_DETAIL_SUCCESS,
      payload: payload
    });
  });

  it('Should create a LoadDetailsFail action', () => {
    const payload = {};
    const action = new userActions.LoadDetailsFail(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.LOAD_DETAIL_FAIL,
      payload: payload
    });
  });

  it('Should create a CreateCollaborator action', () => {
    const payload = {
      data: { projectRoles: [1, 2], teams: [1] },
      projectPk: 1
    };
    const action = new userActions.CreateCollaborator(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.CREATE_COLLABORATOR,
      payload: payload
    });
  });

  it('Should create a CreateCollaboratorSuccess action', () => {
    const payload = new FakeProjectMemberFactory();
    const action = new userActions.CreateCollaboratorSuccess(payload);

    expect( { ...action }).toEqual({
      type: userActions.TypeActionEnum.CREATE_COLLABORATOR_SUCCESS,
      payload: payload
    });
  });

  it('Should create a CreateCollaboratorFail action', () => {
    const action = new userActions.CreateCollaboratorFail({});

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.CREATE_COLLABORATOR_FAIL,
      payload: {}
    });
  });

  it('Should create a EditCollaborator action', () => {
    const payload = {
      data: { projectRoles: [1, 2], teams: [1] },
      projectPk: 1,
      userUuid: 'XXX'
    };
    const action = new userActions.EditCollaborator(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_COLLABORATOR,
      payload: payload
    });
  });

  it('Should create a EditCollaboratorSuccess action', () => {
    const payload = new FakeProjectMemberFactory();
    const action = new userActions.EditCollaboratorSuccess(payload);

    expect( { ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_COLLABORATOR_SUCCESS,
      payload: payload
    });
  });

  it('Should create a EditCollaboratorFail action', () => {
    const action = new userActions.EditCollaboratorFail({});

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_COLLABORATOR_FAIL,
      payload: {}
    });
  });
  it('Should create a CreateParticipant action', () => {
    const payload = {
      data: { name: 'kate', email: 'kate@example.com', teams: [1] },
      projectPk: 1
    };
    const action = new userActions.CreateParticipant(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.CREATE_PARTICIPANT,
      payload: payload
    });
  });

  it('Should create a CreateParticipantSuccess action', () => {
    const payload = new FakeProjectMemberFactory();
    const action = new userActions.CreateParticipantSuccess(payload);

    expect( { ...action }).toEqual({
      type: userActions.TypeActionEnum.CREATE_PARTICIPANT_SUCCESS,
      payload: payload
    });
  });

  it('Should create a CreateParticipantFail action', () => {
    const action = new userActions.CreateParticipantFail({});

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.CREATE_PARTICIPANT_FAIL,
      payload: {}
    });
  });

  it('Should create a EditParticipant action', () => {
    const payload = {
      data: { name: 'kate', email: 'kate@example.com', teams: [1] },
      projectPk: 1,
      userUuid: 'XXX'
    };
    const action = new userActions.EditParticipant(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_PARTICIPANT,
      payload: payload
    });
  });

  it('Should create a EditParticipantSuccess action', () => {
    const payload = new FakeProjectMemberFactory();
    const action = new userActions.EditParticipantSuccess(payload);

    expect( { ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_PARTICIPANT_SUCCESS,
      payload: payload
    });
  });

  it('Should create a EditParticipantFail action', () => {
    const action = new userActions.EditParticipantFail({});

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_PARTICIPANT_FAIL,
      payload: {}
    });
  });

  it('Should create a EditParticipantTeams action', () => {
    const payload = {
      data: { teams: [1] },
      projectPk: 1,
      userUuid: 'XXX'
    };
    const action = new userActions.EditParticipantTeams(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_PARTICIPANT_TEAMS,
      payload: payload
    });
  });

  it('Should create a EditParticipantTeamsSuccess action', () => {
    const payload = new FakeProjectMemberFactory();
    const action = new userActions.EditParticipantTeamsSuccess(payload);

    expect( { ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_PARTICIPANT_TEAMS_SUCCESS,
      payload: payload
    });
  });

  it('Should create a EditParticipantTeamsFail action', () => {
    const action = new userActions.EditParticipantTeamsFail({});

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.EDIT_PARTICIPANT_TEAMS_FAIL,
      payload: {}
    });
  });

  it('Should create a Delete action', () => {
    const payload = {
      projectPk: 1,
      member: new FakeProjectMemberFactory()
    };
    const action = new userActions.Delete(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.DELETE,
      payload: payload
    });
  });

  it('Should create a DeleteSuccess action', () => {
    const payload = 'XXXXXX';
    const action = new userActions.DeleteSuccess(payload);

    expect( { ...action }).toEqual({
      type: userActions.TypeActionEnum.DELETE_SUCCESS,
      payload: payload
    });
  });

  it('Should create a DeleteFail action', () => {
    const action = new userActions.DeleteFail({});

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.DELETE_FAIL,
      payload: {}
    });
  });

  it('Should create a SetSearch action', () => {
    const payload = {
      projectPk: 1,
      searchBy: 'to search ...'
    };
    const action = new userActions.SetSearch(payload);
    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.SEARCH,
      payload: payload
    });
  });

  it('Should create a SetPagination action', () => {
    const payload = {
      projectPk: 1,
      pageIndex: 1,
      pageSize: 10
    };
    const action = new userActions.SetPagination(payload);

    expect({ ...action }).toEqual({
      type: userActions.TypeActionEnum.SET_PAGINATION,
      payload: payload
    });
  });

});
