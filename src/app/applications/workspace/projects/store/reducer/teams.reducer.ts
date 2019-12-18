import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as TeamsActions from '../action/team.action';
import { Team } from '../../models/team.model';


export interface TeamsState extends EntityState<Team> {
  loading: boolean;
  loaded: boolean;
}

const teamsAdapter: EntityAdapter<Team> = createEntityAdapter<Team>({
  selectId: (team: Team) => team.pk
});

export const INITIAL_VALUES = {
  loading: false,
  loaded: false
};

const initialState: TeamsState = teamsAdapter.getInitialState(INITIAL_VALUES);


export function reducer(state: TeamsState = initialState, action: TeamsActions.All): TeamsState {
  switch (action.type) {
    case TeamsActions.TypeActionEnum.LOAD:
      return teamsAdapter.removeAll({...state,
        loading: true,
        loaded: false
      });

    case TeamsActions.TypeActionEnum.LOAD_SUCCESS:
      return teamsAdapter.addAll(<Team[]>action.payload, {
        ... state,
        loading: false,
        loaded: true
      });

    case TeamsActions.TypeActionEnum.LOAD_FAIL:
    case TeamsActions.TypeActionEnum.CREATE_FAIL:
    case TeamsActions.TypeActionEnum.EDIT_FAIL:
    case TeamsActions.TypeActionEnum.DELETE_FAIL:
    case TeamsActions.TypeActionEnum.MOVE_FAIL:
      return { ...state, loading: false };

    case TeamsActions.TypeActionEnum.CREATE:
    case TeamsActions.TypeActionEnum.EDIT:
    case TeamsActions.TypeActionEnum.DELETE:
    case TeamsActions.TypeActionEnum.LOAD_DETAIL:
    case TeamsActions.TypeActionEnum.MOVE:
      return { ...state, loading: true };

    case TeamsActions.TypeActionEnum.CREATE_SUCCESS:
      return teamsAdapter.upsertOne(new Team(action.payload), {
        ... state,
        loading: false
      });

    case TeamsActions.TypeActionEnum.MOVE_SUCCESS:
      return teamsAdapter.upsertMany(action.payload, {
        ... state,
        loading: false
      });

    case TeamsActions.TypeActionEnum.EDIT_SUCCESS:
    case TeamsActions.TypeActionEnum.LOAD_DETAIL_SUCCESS:
    case TeamsActions.TypeActionEnum.UNSELECT_SUCCESS:
    case TeamsActions.TypeActionEnum.SELECT_SUCCESS:
      return teamsAdapter.upsertOne(action.payload, {
        ... state,
        loading: false
      });

    case TeamsActions.TypeActionEnum.DELETE_SUCCESS:
      return teamsAdapter.removeOne(action.payload, {
        ... state,
        loading: false
      });

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
} = teamsAdapter.getSelectors();
export const selectLoading = (state: TeamsState) => state.loading;
export const selectLoaded = (state: TeamsState) => state.loaded;
export const noData = (state: TeamsState) => state.loading === false && state.ids.length === 0;
