import { FakeTeamFactory } from '../../models/team-fake.model';
import * as teamActions from './team.action';
import { Team } from '../../models/team.model';

describe('Workspace -> Team Actions', () => {
  it('Should create a Load action', () => {
    const payload = 1;
    const action = new teamActions.Load(payload);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.LOAD,
      payload: payload
    });
  });

  it('Should create a LoadSuccess action', () => {
    const payload = [new FakeTeamFactory()];
    const action = new teamActions.LoadSuccess(payload);

    expect( { ...action }).toEqual({
      type: teamActions.TypeActionEnum.LOAD_SUCCESS,
      payload: payload
    });
  });

  it('Should create a LoadFail action', () => {
    const action = new teamActions.LoadFail({});

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.LOAD_FAIL,
      payload: {}
    });
  });

  it('Should create a LoadDetail action', () => {
    const value = 1;
    const action = new teamActions.LoadDetails(value);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.LOAD_DETAIL,
      payload: value
    });
  });

  it('Should create a LoadDetailsSuccess action', () => {
    const payload = new FakeTeamFactory();
    const action = new teamActions.LoadDetailsSuccess(payload);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.LOAD_DETAIL_SUCCESS,
      payload: payload
    });
  });

  it('Should create a LoadDetailsFail action', () => {
    const payload = {};
    const action = new teamActions.LoadDetailsFail(payload);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.LOAD_DETAIL_FAIL,
      payload: payload
    });
  });

  it('Should create a Create action', () => {
    const payload = {team: new Team(), projectPk: 1};
    const action = new teamActions.Create(payload);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.CREATE,
      payload: payload
    });
  });

  it('Should create a CreateSuccess action', () => {
    const payload = new FakeTeamFactory();
    const action = new teamActions.CreateSuccess(payload);

    expect( { ...action }).toEqual({
      type: teamActions.TypeActionEnum.CREATE_SUCCESS,
      payload: payload
    });
  });

  it('Should create a CreateFail action', () => {
    const action = new teamActions.CreateFail({});

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.CREATE_FAIL,
      payload: {}
    });
  });

  it('Should create a Edit action', () => {
    const payload = {team: new FakeTeamFactory(), projectPk: 1};
    const action = new teamActions.Edit(payload);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.EDIT,
      payload: payload
    });
  });

  it('Should create a EditSuccess action', () => {
    const payload = new FakeTeamFactory();
    const action = new teamActions.EditSuccess(payload);

    expect( { ...action }).toEqual({
      type: teamActions.TypeActionEnum.EDIT_SUCCESS,
      payload: payload
    });
  });

  it('Should create a EditFail action', () => {
    const action = new teamActions.EditFail({});

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.EDIT_FAIL,
      payload: {}
    });
  });

  it('Should create a Delete action', () => {
    const payload = {team: new FakeTeamFactory(), projectPk: 1};
    const action = new teamActions.Delete(payload);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.DELETE,
      payload: payload
    });
  });

  it('Should create a DeleteSuccess action', () => {
    const payload = 1;
    const action = new teamActions.DeleteSuccess(payload);

    expect( { ...action }).toEqual({
      type: teamActions.TypeActionEnum.DELETE_SUCCESS,
      payload: payload
    });
  });

  it('Should create a DeleteFail action', () => {
    const action = new teamActions.DeleteFail({});

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.DELETE_FAIL,
      payload: {}
    });
  });


  it('Should create a Unselect action', () => {
    const payload = {team: new FakeTeamFactory(), projectPk: 1, teamRolePk: 1};
    const action = new teamActions.Unselect(payload);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.UNSELECT,
      payload: payload
    });
  });

  it('Should create a UnselectSuccess action', () => {
    const payload = new FakeTeamFactory();
    const action = new teamActions.UnselectSuccess(payload);

    expect( { ...action }).toEqual({
      type: teamActions.TypeActionEnum.UNSELECT_SUCCESS,
      payload: payload
    });
  });

  it('Should create a UnselectFail action', () => {
    const action = new teamActions.UnselectFail({});

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.UNSELECT_FAIL,
      payload: {}
    });
  });

    it('Should create a MoveUser action', () => {
    const payload =  {teamPk: 1, projectPk: 1, teamUserRolePk: 1, newTeamPk: 1};
    const action = new teamActions.MoveUser(payload);

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.MOVE,
      payload: payload
    });
  });

  it('Should create a MoveUserSuccess action', () => {
    const payload = [new FakeTeamFactory(), new FakeTeamFactory()];
    const action = new teamActions.MoveUserSuccess(payload);

    expect( { ...action }).toEqual({
      type: teamActions.TypeActionEnum.MOVE_SUCCESS,
      payload: payload
    });
  });

  it('Should create a MoveUserFail action', () => {
    const action = new teamActions.MoveUserFail({});

    expect({ ...action }).toEqual({
      type: teamActions.TypeActionEnum.MOVE_FAIL,
      payload: {}
    });
  });

});
