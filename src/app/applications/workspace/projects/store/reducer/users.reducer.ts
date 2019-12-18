import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as UsersActions from '../action/user.action';
import { ProjectMember } from '../../models/project-member.model';


export interface UsersState extends EntityState<ProjectMember> {
  loading: boolean;
  loaded: boolean;
  pageIndex: number | undefined;
  count: number | undefined;
  pageSize: number | undefined;
  searchBy: string;
  pkSelected: number;
}

const usersAdapter: EntityAdapter<ProjectMember> = createEntityAdapter<ProjectMember>({
  selectId: (obj: ProjectMember) => obj.user.uuid
});

export const INITIAL_VALUES = {
  loading: false,
  loaded: false,
  pageIndex: 1,
  count: undefined,
  pageSize: 15,
  searchBy: '',
  pkSelected: undefined,
};

const initialState: UsersState = usersAdapter.getInitialState(INITIAL_VALUES);


export function reducer(state: UsersState = initialState, action: UsersActions.All): UsersState {
  switch (action.type) {
    case UsersActions.TypeActionEnum.LOAD:
      return usersAdapter.removeAll({...state,
        loading: true,
        loaded: false,
        pkSelected: undefined
      });

    case UsersActions.TypeActionEnum.LOAD_SUCCESS:
      return usersAdapter.addAll(<ProjectMember[]>action.payload.results, {
        ... state,
        count: +action.payload.count,
        loading: false,
        loaded: true
      });

    case UsersActions.TypeActionEnum.LOAD_FAIL:
    case UsersActions.TypeActionEnum.CREATE_COLLABORATOR_FAIL:
    case UsersActions.TypeActionEnum.EDIT_COLLABORATOR_FAIL:
    case UsersActions.TypeActionEnum.CREATE_PARTICIPANT_FAIL:
    case UsersActions.TypeActionEnum.EDIT_PARTICIPANT_FAIL:
    case UsersActions.TypeActionEnum.DELETE_FAIL:
      return { ...state, loading: false };

    case UsersActions.TypeActionEnum.CREATE_COLLABORATOR:
    case UsersActions.TypeActionEnum.EDIT_COLLABORATOR:
    case UsersActions.TypeActionEnum.CREATE_PARTICIPANT:
    case UsersActions.TypeActionEnum.EDIT_PARTICIPANT:
    case UsersActions.TypeActionEnum.DELETE:
    case UsersActions.TypeActionEnum.LOAD_DETAIL:
      return { ...state, loading: true };

    case UsersActions.TypeActionEnum.CREATE_COLLABORATOR_SUCCESS:
    case UsersActions.TypeActionEnum.CREATE_PARTICIPANT_SUCCESS:
      return usersAdapter.addOne(action.payload, {
        ... state,
        count: state.count + 1,
        loading: false
      });

    case UsersActions.TypeActionEnum.EDIT_COLLABORATOR_SUCCESS:
    case UsersActions.TypeActionEnum.EDIT_PARTICIPANT_SUCCESS:
    case UsersActions.TypeActionEnum.EDIT_PARTICIPANT_TEAMS_SUCCESS:
    case UsersActions.TypeActionEnum.LOAD_DETAIL_SUCCESS:
      const newState =  usersAdapter.upsertOne(action.payload, {
        ... state,
        pkSelected: action.payload.pk,
        loading: false
      });
      newState.entities[action.payload.user.uuid] = action.payload;
      return newState;

    case UsersActions.TypeActionEnum.DELETE_SUCCESS:
      return usersAdapter.removeOne(action.payload, {
        ... state,
        count: state.count - 1,
        loading: false
      });

    case UsersActions.TypeActionEnum.SET_PAGINATION:
      return {... state, pageIndex: action.payload.pageIndex, pageSize: action.payload.pageSize};

    case UsersActions.TypeActionEnum.SEARCH:
      return {...state, searchBy: action.payload.searchBy };

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
} = usersAdapter.getSelectors();
export const selectEmptyMoment = (state: UsersState) => !state.loading && state.count === 0 && state.loaded;
export const selectLoading = (state: UsersState) => state.loading;
export const selectLoaded = (state: UsersState) => state.loaded;
export const selectCount = (state: UsersState) => state.count;
export const selectPkSelected = (state: UsersState) => state.pkSelected;
export const selectPageSize = (state: UsersState) => state.pageSize;
export const selectPageIndex = (state: UsersState) => state.pageIndex - 1;
export const selectSearchBy = (state: UsersState) => state.searchBy;
