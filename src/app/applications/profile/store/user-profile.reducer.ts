import { ActionReducerMap } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { ConsultantModel, UserApplicationModel } from '@applications/shared/models';

import * as UserProfileActions from './user-profile.actions';

export const reducers: ActionReducerMap<ProfileState> = {
  profile: reducer
};

export interface ProfileState {
  profile: UserProfileState;
}

export interface UserProfileState {
  user: UserApplicationModel | ConsultantModel;
  currentSlug: string;
  loading: boolean;
}

const initialState: UserProfileState = {
  user: undefined,
  currentSlug: undefined,
  loading: false
};

export function reducer(state = initialState, action: UserProfileActions.All) {
  switch (action.type) {
    case UserProfileActions.ProfileActionEnum.LOAD_USER:
      return {
        ...state,
        loading: true
      };

    case UserProfileActions.ProfileActionEnum.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false
      };

    case UserProfileActions.ProfileActionEnum.LOAD_USER_FAIL:
      return {
        ...state,
        loading: false
      };

    case UserProfileActions.ProfileActionEnum.SET_CURRENT_SLUG:
      return {
        ...state,
        currentSlug: action.payload
      };

    case UserProfileActions.ProfileActionEnum.UPDATE_USER:
      return {
        ...state,
        user: Object.assign(action.payload.user, action.payload.data)
    };

    default:
      return state;
  }
}

/** getters for store state */
export const getLoadingState = (state: AppState): boolean => {
  return state.profile.profile.loading;
};

export const getCurrentSlug = (state: AppState): string => {
  return state.profile.profile.currentSlug;
};

export const getProfileUser = (state: AppState): UserApplicationModel | ConsultantModel => {
  return state.profile.profile.user;
};
