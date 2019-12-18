import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ProjectModel } from '@applications/service/old-project/models/project.model';

import * as fromProject from './projects.actions';

export interface State extends EntityState<ProjectModel> {
  selectedProjectPk: string | null;
}

export const adapter: EntityAdapter<ProjectModel> = createEntityAdapter<ProjectModel>({
  selectId: (project: ProjectModel) => project.pk
});

export const initialState: State = adapter.getInitialState({
  selectedProjectPk: null
});

export function reducer(state = initialState, action: fromProject.ProjectsActions): State {

  switch (action.type) {
    case fromProject.GET_PROJECT: {
      return {
        ...state,
        selectedProjectPk: action.payload
      };
    }

    case fromProject.GET_PROJECT_SUCCESS: {
      const newState =  adapter.upsertOne(action.payload, {
        ... state,
        selectedProjectPk: action.payload.pk
      });
      newState.entities[action.payload.pk] = action.payload;
      return newState;
    }

    default:
      return state;
  }
}

export const getSelectedPk = (state: State) => state.selectedProjectPk;
