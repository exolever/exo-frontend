import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSteps from './steps/step.reducer';
import * as fromTeams from './teams/team.reducer';
import { teamsAdapter } from './teams/team.reducer';

export const reducers: ActionReducerMap<ServiceState> = {
  steps: fromSteps.reducer,
  teams: fromTeams.reducer
};

export interface ServiceState {
  steps: fromSteps.StepsState;
  teams: fromTeams.TeamsState;
}

export const getServiceState = createFeatureSelector<ServiceState>('service');

export const getStepsEntitiesState = createSelector(
  getServiceState,
  state => state.steps
);

export const getStepSelectedPk = createSelector(
  getStepsEntitiesState,
  fromSteps.getSelectedPk
);

export const getStepCurrentPk = createSelector(
  getStepsEntitiesState,
  fromSteps.getCurrentPk
);

export const getStepsLoaded = createSelector(
  getStepsEntitiesState,
  fromSteps.getStepsLoaded
);

export const isUploadingDeliverable = createSelector(
  getStepsEntitiesState,
  fromSteps.isUploadingDeliverable
);

export const isLoading = (state: ServiceState) => {
  return state.steps.loading;
};

export const {
  selectIds: getIdsSteps,
  selectAll: getAllSteps,
  selectEntities: getEntitiesSteps,
  selectTotal: getTotalSteps
} = fromSteps.stepAdapter.getSelectors(getStepsEntitiesState);

export const getStepsEntities = createSelector(
  getStepsEntitiesState,
  (state) => state.entities
);

export const getStepSelected = createSelector(
  getStepsEntities,
  getStepSelectedPk,
  (entities, pk) => pk && entities ? entities[pk] : null
);

export const getFirstAssignment = createSelector(
  getStepSelected,
  (step) => step ? step.assignments[0] : null
);

export const selectPersonalQuiz = createSelector(
  getStepSelected,
  (step) => step.personalQuiz
);

/** TEAMS **/
export const getTeamsState = createSelector(
  getServiceState,
  state => state.teams
);

export const getTeamsEntities = createSelector(
  getTeamsState,
  (state) => state.entities
);

export const getTeamSelectedPk = createSelector(
  getTeamsState,
  (state) => state.selectedTeamPk
);

export const getTeamSelected = createSelector(
  getTeamsEntities,
  getTeamSelectedPk,
  (entities, pk) => entities[pk]
);

export const {
  selectIds: getIdsTeams,
  selectAll: getAllTeams,
  selectEntities: getEntitiesTeams,
  selectTotal: getTotalTeams
} = teamsAdapter.getSelectors(getTeamsState);

