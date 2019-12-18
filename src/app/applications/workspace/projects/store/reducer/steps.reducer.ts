import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as StepsActions from '../action/steps.action';
import { StepModel } from '../../models/step.model';


export interface StepState extends EntityState<StepModel> {
  loading: boolean;
  loaded: boolean;
}

const stepsAdapter: EntityAdapter<StepModel> = createEntityAdapter<StepModel>({
  selectId: (step: StepModel) => step.pk
});

export const INITIAL_VALUES = {
  loading: false,
  loaded: false
};

const initialState: StepState = stepsAdapter.getInitialState(INITIAL_VALUES);


export function reducer(state: StepState = initialState, action: StepsActions.All): StepState {
  switch (action.type) {
    case StepsActions.TypeActionEnum.LOAD:
      return stepsAdapter.removeAll({...state,
        loading: true,
        loaded: false
      });
    case StepsActions.TypeActionEnum.LOAD_SUCCESS:
      return stepsAdapter.addAll(<StepModel[]>action.payload, {
        ... state,
        loading: false,
        loaded: true
      });
    case StepsActions.TypeActionEnum.EDIT:
        return { ...state, loading: true, loaded: false };

    case StepsActions.TypeActionEnum.EDIT_SUCCESS:
      return stepsAdapter.upsertOne(action.payload, {
        ... state,
        loading: false
      });

    case StepsActions.TypeActionEnum.LOAD_FAIL:
    case StepsActions.TypeActionEnum.EDIT_FAIL:
      return { ...state, loading: false };

    default:
      return state;
  }
}

// get the selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = stepsAdapter.getSelectors();

export const selectLoading = (state: StepState) => state.loading;
export const selectLoaded = (state: StepState) => state.loaded;
