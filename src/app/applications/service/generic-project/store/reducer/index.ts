import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

import * as fromGProject from './generic-project.reducer';
import * as fromTeams from './teams.reducer';
import * as fromSteps from './steps.reducer';
import * as fromMembers from './members.reducer';

export interface GenericProjectsState {
  genericProject: fromGProject.StateGenericProject;
  teamsGenericProject: fromTeams.TeamsState;
  stepsGenericProject: fromSteps.StepsState;
  membersGenericProject: fromMembers.MembersState;
}

export const reducers: ActionReducerMap<GenericProjectsState> = {
  genericProject: fromGProject.reducer,
  teamsGenericProject: fromTeams.reducer,
  stepsGenericProject: fromSteps.reducer,
  membersGenericProject: fromMembers.reducer
};

// Public selector for generic projects
const getGProjectState = createFeatureSelector<fromGProject.StateGenericProject>('genericProject');
export const selectSelectedGProject = createSelector(getGProjectState, fromGProject.getSelectedGenericProject);


// Public selectors for steps
const getStepState = createFeatureSelector<fromSteps.StepsState>('stepsGenericProject');

export const selectAllSteps = createSelector(getStepState, fromSteps.selectAll);
export const selectEntitiesSteps = createSelector(getStepState, fromSteps.selectEntities);
export const selectSelectedStepPk = createSelector(getStepState, fromSteps.getSelectedPk);
export const selectCurrentStepPk = createSelector(getStepState, fromSteps.getCurrentPk);
export const selectUploadingDeliverable = createSelector(getStepState, fromSteps.isUploadingDeliverable);
export const selectLoadedSteps = createSelector(getStepState, fromSteps.getLoaded);
export const selectLoadingSteps = createSelector(getStepState, fromSteps.getLoading);
export const getStepSelected = createSelector(
  selectEntitiesSteps,
  selectSelectedStepPk,
  (entities, pk) => pk && entities ? entities[pk] : null
);
export const selectStepSelected = createSelector(
  selectEntitiesSteps,
  selectSelectedStepPk,
  (entities, pk) => pk && entities ? entities[pk] : null
);

export const selectFirstAssignment = createSelector(
  selectStepSelected,
  (step) => step ? step.assignments[0] : null
);

export const selectPersonalQuiz = createSelector(
  selectStepSelected,
  (step) => step.personalQuiz
);


// Public selectors for teams
const getTeamState = createFeatureSelector<fromTeams.TeamsState>('teamsGenericProject');
export const selectAllTeams = createSelector(getTeamState, fromTeams.selectAll);
export const selectEntitiesTeams = createSelector(getTeamState, fromTeams.selectEntities);
export const selectSelectedTeamPk = createSelector(getTeamState, fromTeams.getSelectedPk);
export const selectLoadedTeams = createSelector(getTeamState, fromTeams.getLoaded);
export const selectLoadingTeams = createSelector(getTeamState, fromTeams.getLoading);

export const selectTeamSelected = createSelector(
  selectEntitiesTeams,
  selectSelectedTeamPk,
  (entities, pk) => entities[pk]
);

// Public selectors for members
const getMembersState = createFeatureSelector<fromMembers.MembersState>('membersGenericProject');
export const selectAllMembers = createSelector(getMembersState, fromMembers.selectAll);
export const usersAreLoading = createSelector(getMembersState, fromMembers.selectLoading);
export const usersEmptyMoment = createSelector(getMembersState, fromMembers.selectEmptyMoment);
export const selectCountMembers = createSelector(getMembersState, fromMembers.selectCount);
export const selectPageSizeMembers = createSelector(getMembersState, fromMembers.selectPageSize);
export const selectPageIndexMembers = createSelector(getMembersState, fromMembers.selectPageIndex);
export const selectSearchByMembers = createSelector(getMembersState, fromMembers.selectSearchBy);



export const selectHeadCoachOrTeamRole = createSelector(
  selectSelectedGProject,
  selectTeamSelected,
  (project, team) => {
    const projectRole = project.projectRoles.find(role => role.code === SprintRoleEnum.HEAD_COACH_SPRINT);
    const teamRole = team.roles.length ? team.roles[0] : undefined;
    return projectRole ? projectRole.code : teamRole ? teamRole.code : undefined;
  }
);
