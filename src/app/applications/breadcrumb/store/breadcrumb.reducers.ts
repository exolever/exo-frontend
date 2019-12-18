import { AppState } from '@core/store/reducers';
import * as crumbActions from '@applications/breadcrumb/store/breadcrumb.actions';

export const reducers = {
  breadcrumbs: reducer
};

export interface IBreadCrumb {
  label: string;
  url?: string; // This attr is optional, by default get the current route.
}

export interface BreadCrumbState {
  crumbs: IBreadCrumb[];
}

const initialState: BreadCrumbState = {
  crumbs: []
};

export function reducer(state = initialState, action: crumbActions.All): BreadCrumbState {
  switch (action.type) {
    case crumbActions.BreadCrumbActions.UPDATE_ROOT:
      if (action && action.payload) {
        state.crumbs[0] = action.payload;
      }
      return {
        crumbs: state.crumbs
      };

    case crumbActions.BreadCrumbActions.UPDATE:
      // If we navigate through BreadCrumb Steps remove the following crumbs.
      const currentCrumb = state.crumbs.findIndex((crumb) => crumb.label === action.payload.label);
      if (currentCrumb > 0) {
        state.crumbs = state.crumbs.slice(0, currentCrumb);
      }
      return {
        crumbs: state.crumbs.concat(action.payload)
      };

    case crumbActions.BreadCrumbActions.RESET:
      return {
        crumbs: []
      };

    case crumbActions.BreadCrumbActions.POP_CRUMB:
      state.crumbs.pop(); // Remove last item from state
      return {
        crumbs: state.crumbs
      };

    case crumbActions.BreadCrumbActions.PUSH_CRUMB:
      state.crumbs.push(action.payload); // Add item to the state
      return {
        crumbs: state.crumbs
      };

    default:
      return state;
  }
}

export const getCrumbs = (state: AppState): IBreadCrumb[] => {
  return state.breadcrumbs['breadcrumbs'].crumbs;
};
