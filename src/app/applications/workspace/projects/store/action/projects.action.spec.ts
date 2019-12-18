import { FakeGenericProjectFactory } from '../../models/project-fake.model';
import * as projectActions from './projects.action';

describe('Workspace -> Project Actions', () => {
  it('Should create a Load action', () => {
    const action = new projectActions.Load();

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.LOAD
    });
  });

  it('Should create a LoadSuccess action', () => {
    const payload = {
      results: [new FakeGenericProjectFactory()],
      count: '1',
      next: undefined,
      previous: undefined
    };

    const action = new projectActions.LoadSuccess(payload);

    expect( { ...action }).toEqual({
      type: projectActions.TypeActionEnum.LOAD_SUCCESS,
      payload: payload
    });
  });

  it('Should create a LoadFail action', () => {
    const action = new projectActions.LoadFail({});

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.LOAD_FAIL,
      payload: {}
    });
  });

  it('Should create a Create action', () => {
    const payload = {};
    const action = new projectActions.Create(payload);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.CREATE,
      payload: payload
    });
  });

  it('Should create a CreateSuccess action', () => {
    const payload = new FakeGenericProjectFactory();
    const action = new projectActions.CreateSuccess(payload);

    expect( { ...action }).toEqual({
      type: projectActions.TypeActionEnum.CREATE_SUCCESS,
      payload: payload
    });
  });

  it('Should create a CreateFail action', () => {
    const action = new projectActions.CreateFail({});

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.CREATE_FAIL,
      payload: {}
    });
  });

  it('Should create a Delete action', () => {
    const payload = new FakeGenericProjectFactory();
    const action = new projectActions.Delete(payload);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.DELETE,
      payload: payload
    });
  });

  it('Should create a DeleteSuccess action', () => {
    const value = 1;
    const action = new projectActions.DeleteSuccess(value);

    expect( { ...action }).toEqual({
      type: projectActions.TypeActionEnum.DELETE_SUCCESS,
      payload: value
    });
  });

  it('Should create a DeleteFail action', () => {
    const action = new projectActions.DeleteFail({});

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.DELETE_FAIL,
      payload: {}
    });
  });

  it('Should create a Edit action', () => {
    const payload = new FakeGenericProjectFactory();
    const action = new projectActions.Edit(payload);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.EDIT,
      payload: payload
    });
  });

  it('Should create a EditSuccess action', () => {
    const payload = new FakeGenericProjectFactory();
    const action = new projectActions.EditSuccess(payload);

    expect( { ...action }).toEqual({
      type: projectActions.TypeActionEnum.EDIT_SUCCESS,
      payload: payload
    });
  });

  it('Should create a EditFail action', () => {
    const action = new projectActions.EditFail({});

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.EDIT_FAIL,
      payload: {}
    });
  });

  it('Should create a SetSearch action', () => {
    const value = 'to search ...';
    const action = new projectActions.SetSearch(value);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.SEARCH,
      payload: value
    });
  });
  it('Should create a SetPagination action', () => {
    const value = {pageIndex: 1, pageSize: 10};
    const action = new projectActions.SetPagination(value);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.SET_PAGINATION,
      payload: value
    });
  });

  it('Should create a Sortby action', () => {
    const value = 'date';
    const action = new projectActions.SortBy(value);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.SORTBY,
      payload: value
    });
  });

  it('Should create a LoadDetail action', () => {
    const value = 1;
    const action = new projectActions.LoadDetails(value);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.LOAD_DETAIL,
      payload: value
    });
  });

  it('Should create a LoadDetailsSuccess action', () => {
    const value = new FakeGenericProjectFactory();
    const action = new projectActions.LoadDetailsSuccess(value);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.LOAD_DETAIL_SUCCESS,
      payload: value
    });
  });

  it('Should create a LoadDetailsFail action', () => {
    const value = {};
    const action = new projectActions.LoadDetailsFail(value);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.LOAD_DETAIL_FAIL,
      payload: value
    });
  });

  it('Should create a Restore action', () => {
    const action = new projectActions.RestoreState();

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.RESTORE
    });
  });

  it('Should create a Publish action', () => {
    const payload = {projectPk: 1, message: ''};
    const action = new projectActions.Publish(payload);

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.PUBLISH,
      payload: payload
    });
  });

  it('Should create a PublishSuccess action', () => {
    const payload = new FakeGenericProjectFactory();
    const action = new projectActions.PublishSuccess(payload);

    expect( { ...action }).toEqual({
      type: projectActions.TypeActionEnum.PUBLISH_SUCCESS,
      payload: payload
    });
  });

  it('Should create a PublishFail action', () => {
    const action = new projectActions.PublishFail({});

    expect({ ...action }).toEqual({
      type: projectActions.TypeActionEnum.PUBLISH_FAIL,
      payload: {}
    });
  });
});
