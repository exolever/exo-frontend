import { AppState } from '@core/store/reducers';
import { UserModel } from '@core/models/user/user.model';
import * as fromActions from './user.action';

export const reducers = {
  user: reducer
};

export interface UserState {
  user: UserModel;
  loggedIntercom: boolean;
}

const initialState: UserState = {
  user: undefined,
  loggedIntercom: false,
};

export function reducer(state: UserState = initialState, action: fromActions.UserActions): UserState {
  switch (action.type) {

    case fromActions.GET_USER: {
      return {
        ...state
      };
    }

    case fromActions.GET_USER_SUCCESS: {
      return {
        ...state,
        user: action.payload
      };
    }

    case fromActions.GET_USER_FAIL: {
      return {
        ...state
      };
    }

    // Update the user with a new instance of user
    case fromActions.UPDATE_USER: {
      return {
        ...state,
        user: action.payload
      };
    }

    // Update some attributes of user with information sent from payload
    case fromActions.UPDATE_DATA_USER: {
      const newUser = Object.assign(new UserModel(), { ...state.user, ...action.payload});
      return {
        ...state,
        user: newUser
      };
    }

    case fromActions.LOGGED_INTERCOM: {
      return {
        ...state,
        loggedIntercom: action.payload
      };
    }

    case fromActions.UPDATE_USER_PICTURE:
      return {
        ...state,
        user: Object.assign(new UserModel(), { ...state.user, ...action.payload})
      };

    case fromActions.LOGOUT_USER_SUCCESS: {
      return initialState;
    }

    default:
      return state;
  }
}

// selectors
export const getUser = (state: AppState) => state.user.user;
export const getLoggedIntercom = (state: AppState) => state.user.loggedIntercom;

