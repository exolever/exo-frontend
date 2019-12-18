import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as ProjectActions from '../action/projects.action';
import { GenericProject } from '../../models/project.model';


export interface ProjectsState extends EntityState<GenericProject> {
  loading: boolean;
  loaded: boolean;
  pageIndex: number | undefined;
  count: number | undefined;
  pageSize: number | undefined;
  pkSelected: number;
  searchBy: string;
  sortBy: string;
}

const projectsAdapter: EntityAdapter<GenericProject> = createEntityAdapter<GenericProject>({
  selectId: (project: GenericProject) => project.pk
});

export const INITIAL_VALUES = {
  loading: false,
  loaded: false,
  pageIndex: 1,
  count: undefined,
  pageSize: 15,
  pkSelected: undefined,
  searchBy: '',
  sortBy: 'date'
};

const initialState: ProjectsState = projectsAdapter.getInitialState(INITIAL_VALUES);


export function reducer(state: ProjectsState = initialState, action: ProjectActions.All): ProjectsState {
  switch (action.type) {
    case ProjectActions.TypeActionEnum.LOAD:
      return projectsAdapter.removeAll({...state,
        loading: true,
        loaded: false,
        pkSelected: undefined
      });

    case ProjectActions.TypeActionEnum.SEARCH:
      return {...state, searchBy: action.payload };

    case ProjectActions.TypeActionEnum.LOAD_SUCCESS:
      return projectsAdapter.addAll(<GenericProject[]>action.payload.results, {
        ... state,
        count: +action.payload.count,
        loading: false,
        loaded: true
      });

    case ProjectActions.TypeActionEnum.LOAD_FAIL:
    case ProjectActions.TypeActionEnum.CREATE_FAIL:
    case ProjectActions.TypeActionEnum.EDIT_FAIL:
    case ProjectActions.TypeActionEnum.DELETE_FAIL:
      return { ...state, loading: false };

    case ProjectActions.TypeActionEnum.CREATE:
    case ProjectActions.TypeActionEnum.EDIT:
    case ProjectActions.TypeActionEnum.DELETE:
    case ProjectActions.TypeActionEnum.LOAD_DETAIL:
      return { ...state, loading: true };

    case ProjectActions.TypeActionEnum.CREATE_SUCCESS:
      return projectsAdapter.upsertOne(new GenericProject(action.payload), {
        ... state,
        count: state.count + 1,
        loading: false
      });

    case ProjectActions.TypeActionEnum.EDIT_SUCCESS:
    case ProjectActions.TypeActionEnum.LOAD_DETAIL_SUCCESS:
    case ProjectActions.TypeActionEnum.PUBLISH_SUCCESS:
    case ProjectActions.TypeActionEnum.SETTINGS_SUCCESS:
      const newState =  projectsAdapter.upsertOne(action.payload, {
        ... state,
        pkSelected: action.payload.pk,
        loading: false
      });
      newState.entities[action.payload.pk] = action.payload;
      return newState;

    case ProjectActions.TypeActionEnum.DELETE_SUCCESS:
      return projectsAdapter.removeOne(action.payload, {
        ... state,
        count: state.count - 1,
        loading: false
      });

    case ProjectActions.TypeActionEnum.RESTORE:
      return projectsAdapter.getInitialState({
        ...INITIAL_VALUES,
        searchBy: state.searchBy,
        pageSize: state.pageSize
      });

    case ProjectActions.TypeActionEnum.SET_PAGINATION:
      return {... state, pageIndex: action.payload.pageIndex, pageSize: action.payload.pageSize};

    case ProjectActions.TypeActionEnum.SORTBY:
      return {... state, sortBy: action.payload};

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
} = projectsAdapter.getSelectors();
export const selectEmptyMoment = (state: ProjectsState) => !state.loading && state.count === 0 && state.loaded;
export const selectLoading = (state: ProjectsState) => state.loading;
export const selectLoaded = (state: ProjectsState) => state.loaded;
export const selectCount = (state: ProjectsState) => state.count;
export const selectPkSelected = (state: ProjectsState) => state.pkSelected;
export const selectSearchBy = (state: ProjectsState) => state.searchBy;
export const selectPageSize = (state: ProjectsState) => state.pageSize;
export const selectPageIndex = (state: ProjectsState) => state.pageIndex - 1;
export const selectSortBy = (state: ProjectsState) => state.sortBy;
