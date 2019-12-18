import * as fromActions from './error.action';

export const errorReducer = {
  error: reducer
};

export function reducer(state: any = null, action: fromActions.ErrorActions) {
  switch (action.type) {

    case fromActions.ADD_GLOBAL_ERROR: {
      return action.payload;
    }
    case fromActions.CLEAR_STORE: {
      return undefined;
    }

    default:
      return state;
  }
}
