import { GenericProject } from '@applications/workspace/projects/models/project.model';
import * as fromGProject from '../actions/generic-project.action';

export interface StateGenericProject {
  selectedProject: GenericProject;
}

export const initialState: StateGenericProject = {
  selectedProject: undefined
};

export function reducer(state = initialState, action: fromGProject.GProjectsActions): StateGenericProject {

  switch (action.type) {
    case fromGProject.TypeActionEnum.GET_GPROJECT_SUCCESS: {
      return {
        ...state,
        selectedProject: action.payload
      };
    }
    default:
      return state;
  }
}
export const getSelectedGenericProject = (state: StateGenericProject ) => state.selectedProject;

