import * as fromProjects from './projects.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { getUser } from '@core/store/user/user.reducer';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';


export interface ProjectsState {
  projects: fromProjects.State;
}

export const reducers: ActionReducerMap<ProjectsState> = {
  projects: fromProjects.reducer
};

export const getProjectsState = createFeatureSelector<ProjectsState>('projects');

export const getProjectsEntitiesState = createSelector(
  getProjectsState,
  state => state.projects
);

export const getSelectedProjectPk = createSelector(
  getProjectsEntitiesState,
  fromProjects.getSelectedPk
);

export const {
  selectIds: getProjectsIds,
  selectEntities: getProjectsEntities,
  selectAll: getAllProjects,
  selectTotal: getTotalProjects,
} = fromProjects.adapter.getSelectors(getProjectsEntitiesState);

export const getSelectedProject = createSelector(
  getProjectsEntities,
  getSelectedProjectPk,
  (entities, selectedPk) => {
    return selectedPk && entities[selectedPk];
  }
);

export const selectHeadCoachOrTeamRole = createSelector(
  getSelectedProject,
  getUser,
  (project, user) => {
    if (user.isSuperuser) {
      return SprintRoleEnum.HEAD_COACH_SPRINT;
    } else {
      const res = project ?
        project.consultantsRoles.concat(project.usersRoles).filter(role => role.userPk === user.pk) : [];
      const roles = res.filter(r =>
        [
          SprintRoleEnum.HEAD_COACH_SPRINT.toString(),
          SprintRoleEnum.SPRINT_COACH_SPRINT.toString(),
          SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT
        ].includes(r.roleCode));
      return roles ? roles[0].roleCode : '';
    }
  }
);
