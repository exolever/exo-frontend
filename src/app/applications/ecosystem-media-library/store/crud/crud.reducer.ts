import { Resource } from '../resource.model';
import * as CrudActions from './crud.actions';

export interface CrudState {
  resources: Resource[];
  resourcesCount: number;
}

const initialState: CrudState = {
  resources: undefined,
  resourcesCount: undefined
};

export function reducer(state = initialState, action: CrudActions.All): CrudState {
  switch (action.type) {
    case CrudActions.UPLOAD_SUCCESS:
      return {
        ...state,
        resources: state.resources.concat(action.payload),
        resourcesCount: state.resourcesCount + 1
      };
    case CrudActions.UPDATE_SUCCESS:
    case CrudActions.UPLOAD_SUCCESS_NOTIFICATION:
      return {
        ...state,
        resources: state.resources.map(obj => action.payload.pk === obj.pk ? action.payload : obj)
      };
    case CrudActions.DELETE_SUCCESS:
      const newResources = state.resources.filter(item => item.pk !== action.payload.pk);
      return {
        ...state,
        resources: newResources,
        resourcesCount: state.resourcesCount - 1
      };
    case CrudActions.LOAD_RESOURCES:
      return {
        ...state,
        resources: action.payload.results,
        resourcesCount: action.payload.count
      };
    default:
      return state;
  }
}
