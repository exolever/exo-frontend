import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { TeamModel } from '../../models/team.model';
import * as fromTeam from './team.action';

export interface TeamsState extends EntityState<TeamModel> {
  selectedTeamPk: string | undefined;
  loaded: boolean;
  loading: boolean;
}

export const teamsAdapter: EntityAdapter<TeamModel> =
  createEntityAdapter<TeamModel>({
    selectId: (team: TeamModel) => team.pk
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

    case fromTeam.LOAD_TEAMS: {

      return {
        ...state,
        loading: true
      };
    }

    case fromTeam.LOAD_TEAMS_SUCCESS: {

      return teamsAdapter.addAll(action.payload, {
        loaded: true,
        loading: false,
        ...state
      });
    }

    case fromTeam.LOAD_TEAMS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromTeam.SET_TEAM_SELECTED: {
      return {
        ...state,
        selectedTeamPk: action.payload
      };
    }

    default:
      return state;
  }
}
