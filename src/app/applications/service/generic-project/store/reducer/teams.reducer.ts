import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Team } from '@applications/workspace/projects/models/team.model';
import * as fromTeam from '../actions/teams.actions';

export interface TeamsState extends EntityState<Team> {
  selectedTeamPk: number | undefined;
  loaded: boolean;
  loading: boolean;
}

export const teamsAdapter: EntityAdapter<Team> =
  createEntityAdapter<Team>({
    selectId: (team: Team) => team.pk
  });

export const initialState: TeamsState = teamsAdapter.getInitialState({
  selectedTeamPk: undefined,
  loaded: false,
  loading: false,
});

export const getSelectedTeam = (state: TeamsState) =>
  state.selectedTeamPk ? state.entities[state.selectedTeamPk] : null;

export function reducer(state: TeamsState = initialState, action: fromTeam.TeamsActions): TeamsState {
  switch (action.type) {

    case fromTeam.TypeActionEnum.LOAD_GPROJECT_TEAMS_SUCCESS: {
      return teamsAdapter.addAll(action.payload, {
        loaded: true,
        loading: false,
        ...state
      });
    }

    case fromTeam.TypeActionEnum.LOAD_GPROJECT_TEAMS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromTeam.TypeActionEnum.SET_GROJECT_TEAMS_SELECTED: {
      return {
        ...state,
        selectedTeamPk: action.payload
      };
    }

    default:
      return state;
  }
}

export const {
  selectEntities,
  selectAll,
} = teamsAdapter.getSelectors();

export const getSelectedPk = (state: TeamsState) => state.selectedTeamPk;
export const getLoaded = (state: TeamsState) => state.loaded;
export const getLoading = (state: TeamsState) => state.loading;
