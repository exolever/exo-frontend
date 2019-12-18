import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { RoleCategoryModel } from '@core/modules/roles/models';
import * as fromActions from './roles.action';

export interface RolesState extends EntityState<RoleCategoryModel> {}

const roleAdapter: EntityAdapter<RoleCategoryModel> =
  createEntityAdapter<RoleCategoryModel>({
    selectId: (roleCategory: RoleCategoryModel) => roleCategory.code
  });

const initialState: RolesState = roleAdapter.getInitialState({});

export function reducer(state: RolesState = initialState, action: fromActions.RolesAction) {
  switch (action.type) {
    case fromActions.GET_ROLES: {
      return {
        ...state,
      };
    }

    case fromActions.GET_ROLES_SUCCESS: {
      return roleAdapter.addAll(action.payload, state);
    }

    case fromActions.GET_ROLES_FAIL: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = roleAdapter.getSelectors();

export const getRolesByCategory = createSelector(
  selectEntities,
  (entities, props) => entities ? entities[props].roles : undefined
);
