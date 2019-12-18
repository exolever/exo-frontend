import { FakeStepFactory } from '../../models/step-fake.model';
import * as stepsActions from './steps.action';

describe('Workspace -> Steps Actions', () => {
  const fakeStep = new FakeStepFactory();

  it('Should create a Load action', () => {
    const value = 1;
    const action = new stepsActions.Load(value);

    expect({ ...action }).toEqual({
      type: stepsActions.TypeActionEnum.LOAD,
      payload: value
    });
  });

  it('Should create a LoadSuccess action', () => {
    const value = [fakeStep];
    const action = new stepsActions.LoadSuccess(value);

    expect( { ...action }).toEqual({
      type: stepsActions.TypeActionEnum.LOAD_SUCCESS,
      payload: value
    });
  });

  it('Should create a LoadFail action', () => {
    const action = new stepsActions.LoadFail({});

    expect({ ...action }).toEqual({
      type: stepsActions.TypeActionEnum.LOAD_FAIL,
      payload: {}
    });
  });

  it('Should create a Edit action', () => {
    const payload = {
      step: fakeStep,
      projectPk: 1
    };
    const action = new stepsActions.Edit(payload);

    expect({ ...action }).toEqual({
      type: stepsActions.TypeActionEnum.EDIT,
      payload: payload
    });
  });

  it('Should create a EditSuccess action', () => {
    const action = new stepsActions.EditSuccess(fakeStep);

    expect( { ...action }).toEqual({
      type: stepsActions.TypeActionEnum.EDIT_SUCCESS,
      payload: fakeStep
    });
  });

  it('Should create a EditFail action', () => {
    const action = new stepsActions.EditFail({});

    expect({ ...action }).toEqual({
      type: stepsActions.TypeActionEnum.EDIT_FAIL,
      payload: {}
    });
  });
});
