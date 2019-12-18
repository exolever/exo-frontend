import * as stepsActions from '../action/steps.action';
import { FakeStepFactory } from '../../models/step-fake.model';
import { StepState } from './steps.reducer';
import * as fromSteps from './steps.reducer';

describe('StepsReducer', () => {
  let steps = [];
  let initialState: StepState;
  const fakeStep = new FakeStepFactory();

  beforeEach(() => {
    steps = [fakeStep];
    initialState = {
      ids: [],
      entities: {},
      loading: false,
      loaded: false,
    };
  });

  it('Should return the default state', () => {
    const action = { } as any;
    const state = fromSteps.reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('Should set the load config', () => {
    const action = new stepsActions.Load(1);
    const state = fromSteps.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      loaded: false
    });
  });

  it('Should load steps', () => {
    const action = new stepsActions.LoadSuccess(steps);
    const state = fromSteps.reducer(initialState, action);
    expect(Object.values(state.entities)).toEqual(steps);
  });

  it('Should set loading a false with LOAD_FAIL', () => {
    const action = new stepsActions.LoadFail({});
    const state = fromSteps.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with EDIT_FAIL', () => {
    const action = new stepsActions.EditFail({});
    const state = fromSteps.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a true with EDIT', () => {
    const payload = {step: fakeStep, projectPk: 1};
    const action = new stepsActions.Edit(payload);
    const state = fromSteps.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true, loaded: false});
  });

  it('Should set loading a true with EDIT_SUCCESS', () => {
    const loadAction = new stepsActions.LoadSuccess(steps);
    const oldState = fromSteps.reducer(initialState, loadAction);
    fakeStep.name = 'new name';
    const editAction = new stepsActions.EditSuccess(fakeStep);
    const newState = fromSteps.reducer(oldState, editAction);
    expect(newState).toEqual({...newState, loading: false});
    expect(newState.entities[fakeStep.pk].name).toEqual(fakeStep.name);
  });
});
