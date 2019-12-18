import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as CirclesActions from '../action/circles.action';
import { CirclesState } from './circles.reducer';
import { Circle } from '../../models/circle.model';
import { UserModel } from '@core/models';


export interface CirclesState extends EntityState<Circle> {
  loading: boolean;
  loaded: boolean;
  slugCircleSelected: string;
  members: Array<UserModel>;
  suggestedCircles: Circle[];
}

const circlesAdapter: EntityAdapter<Circle> = createEntityAdapter<Circle>({
  selectId: (circle: Circle) => circle.slug,
  sortComparer: (a: Circle, b: Circle) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
});


const initialState: CirclesState = circlesAdapter.getInitialState({
  loading: false,
  loaded: false,
  slugCircleSelected: undefined,
  members: [],
  suggestedCircles: [],
});


export function reducer(state: CirclesState = initialState, action: CirclesActions.All): CirclesState {
  switch (action.type) {
    case CirclesActions.TypeActionEnum.LOAD_CIRCLES:
    case CirclesActions.TypeActionEnum.LOAD_CIRCLE:
    case CirclesActions.TypeActionEnum.CREATE_CIRCLE:
    case CirclesActions.TypeActionEnum.UPDATE_CIRCLE:
      return {...state,
        loading: true,
        loaded: false
      };

    case CirclesActions.TypeActionEnum.CREATE_CIRCLE_SUCCESS:
    case CirclesActions.TypeActionEnum.UPDATE_CIRCLE_SUCCESS:
    case CirclesActions.TypeActionEnum.LOAD_CIRCLE_SUCCESS:
      const newState = circlesAdapter.upsertOne(action.payload, {
        ... state,
        loading: false,
        loaded: true
      });

      newState.entities[action.payload.slug] = action.payload;
      return newState;

    case CirclesActions.TypeActionEnum.LOAD_CIRCLES_SUCCESS:
      // const stateWithoutOldEntities = circlesAdapter.removeMany(action.payload.map(c => c.slug), state);
      return circlesAdapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });

    case CirclesActions.TypeActionEnum.LOAD_CIRCLES_FAIL:
    case CirclesActions.TypeActionEnum.CREATE_CIRCLE_FAIL:
    case CirclesActions.TypeActionEnum.UPDATE_CIRCLE_FAIL:
    case CirclesActions.TypeActionEnum.LOAD_CIRCLE_FAIL:
      return {... state, loading: false, loaded: true};

    case CirclesActions.TypeActionEnum.SELECT_CIRCLE:
      return {... state, slugCircleSelected: action.payload };

    case CirclesActions.TypeActionEnum.LEAVE_CIRCLE_SUCCESS:
      return circlesAdapter.removeOne(action.payload.slug, {
        ...state,
        suggestedCircles: [...state.suggestedCircles, action.payload]
      });

    case CirclesActions.TypeActionEnum.UPDATE_SUGGESTED_CIRCLES:
      return {... state, suggestedCircles: action.payload};

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
} = circlesAdapter.getSelectors();

export const selectLoading = (state: CirclesState) => state.loading;
export const selectLoaded = (state: CirclesState) => state.loaded;
export const selectSlugSelected = (state: CirclesState) => state.slugCircleSelected;
export const selectSuggestedCircles = (state: CirclesState) => state.suggestedCircles;
