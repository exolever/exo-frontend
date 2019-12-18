import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromProjects from './projects.reducer';
import * as fromTeams from './teams.reducer';
import * as fromSteps from './steps.reducer';
import * as fromUsers from './users.reducer';

export interface ProjectsState {
  projects: fromProjects.ProjectsState;
  teamsProjectSelected: fromTeams.TeamsState;
  stepsProjectSelected: fromSteps.StepState;
  usersProjectSelected: fromUsers.UsersState;
}

export const reducers: ActionReducerMap<ProjectsState> = {
  projects: fromProjects.reducer,
  teamsProjectSelected: fromTeams.reducer,
  stepsProjectSelected: fromSteps.reducer,
  usersProjectSelected: fromUsers.reducer
};

// Public selectors for projects
const selectProjectsState = createFeatureSelector<fromProjects.ProjectsState>('projects');
export const selectProjectsIds = createSelector(selectProjectsState, fromProjects.selectIds);
export const selectProjectsEntities = createSelector(selectProjectsState, fromProjects.selectEntities);
export const selectAllProjects = createSelector(selectProjectsState, fromProjects.selectAll);
export const selectProjectsTotal = createSelector(selectProjectsState, fromProjects.selectTotal);
export const projectsEmptyMoment = createSelector(selectProjectsState, fromProjects.selectEmptyMoment);
export const projectsAreLoading = createSelector(selectProjectsState, fromProjects.selectLoading);
export const selectCountProjects = createSelector(selectProjectsState, fromProjects.selectCount);
export const selectPageSizeProject = createSelector(selectProjectsState, fromProjects.selectPageSize);
export const selectPageIndexProject = createSelector(selectProjectsState, fromProjects.selectPageIndex);
export const selectSearchBy = createSelector(selectProjectsState, fromProjects.selectSearchBy);
export const selectSortBy = createSelector(selectProjectsState, fromProjects.selectSortBy);
export const selectLoaded = createSelector(selectProjectsState, fromProjects.selectLoaded);
export const selectProjectSelected = createSelector(
  fromProjects.selectEntities, fromProjects.selectPkSelected, (entities, pkSelected) => entities[pkSelected]);


// Public selectors for projects
const selectStepsState = createFeatureSelector<fromSteps.StepState>('stepsProjectSelected');
export const selectAllSteps = createSelector(selectStepsState, fromSteps.selectAll);
export const stepsAreLoading = createSelector(selectStepsState, fromSteps.selectLoading);

// Public selectors for teams
const selectTeamState = createFeatureSelector<fromTeams.TeamsState>('teamsProjectSelected');
export const selectAllTeams = createSelector(selectTeamState, fromTeams.selectAll);
export const teamsAreLoading = createSelector(selectTeamState, fromTeams.selectLoading);
export const emptyMoment = createSelector(selectTeamState, fromTeams.noData);

// Public selectors for users
const selectUserState = createFeatureSelector<fromUsers.UsersState>('usersProjectSelected');
export const selectAllUsers = createSelector(selectUserState, fromUsers.selectAll);
export const usersAreLoading = createSelector(selectUserState, fromUsers.selectLoading);
export const usersEmptyMoment = createSelector(selectUserState, fromUsers.selectEmptyMoment);
export const selectCountUsers = createSelector(selectUserState, fromUsers.selectCount);
export const selectPageSizeUsers = createSelector(selectUserState, fromUsers.selectPageSize);
export const selectPageIndexUsers = createSelector(selectUserState, fromUsers.selectPageIndex);
export const selectSearchByUsers = createSelector(selectUserState, fromUsers.selectSearchBy);

