import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { ProjectMember } from '@applications/workspace/projects/models/project-member.model';

import * as MembersActions from '../actions/members.action';


export interface MembersState extends EntityState<ProjectMember> {
  loading: boolean;
  loaded: boolean;
  pageIndex: number | undefined;
  count: number | undefined;
  pageSize: number | undefined;
  searchBy: string;
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
};

const initialState: MembersState = usersAdapter.getInitialState(INITIAL_VALUES);

export function reducer(state: MembersState = initialState, action: MembersActions.All): MembersState {
  switch (action.type) {
    case MembersActions.TypeActionEnum.LOAD_MEMBERS_GENERIC_PROJECT:
      return { ...state, loading: true };

    case MembersActions.TypeActionEnum.LOAD_MEMBERS_GENERIC_PROJECT_SUCCESS:
      return usersAdapter.addAll(<ProjectMember[]>action.payload.results, {
        ... state,
        count: +action.payload.count,
        loading: false,
        loaded: true
      });

    case MembersActions.TypeActionEnum.LOAD_MEMBERS_GENERIC_PROJECT_FAIL:
      return { ...state, loading: false };

    case MembersActions.TypeActionEnum.SET_PAGINATION_MEMBERS_GENERIC_PROJECT:
      return {... state, pageIndex: action.payload.pageIndex, pageSize: action.payload.pageSize};

    case MembersActions.TypeActionEnum.SEARCH_MEMBERS_GENERIC_PROJECT:
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
export const selectEmptyMoment = (state: MembersState) => !state.loading && state.count === 0 && state.loaded;
export const selectLoading = (state: MembersState) => state.loading;
export const selectLoaded = (state: MembersState) => state.loaded;
export const selectCount = (state: MembersState) => state.count;
export const selectPageSize = (state: MembersState) => state.pageSize;
export const selectPageIndex = (state: MembersState) => state.pageIndex - 1;
export const selectSearchBy = (state: MembersState) => state.searchBy;
