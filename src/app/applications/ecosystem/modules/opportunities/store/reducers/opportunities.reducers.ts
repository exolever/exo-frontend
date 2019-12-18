import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { OpportunityModel } from '../../models/opportunity.model';
import * as opportunitiesActions from '../actions/opportunities.action';

export interface OpportunitiesState extends EntityState<OpportunityModel> {
  loading: boolean;
  loaded: boolean;
  pageIndex: number | undefined;
  count: number | undefined;
  pageSize: number | undefined;
  search: string;
}

export const opportunityAdapter: EntityAdapter<OpportunityModel> =
  createEntityAdapter<OpportunityModel>({
    selectId: (opportunity: OpportunityModel) => opportunity.pk
  });


export const initialState: OpportunitiesState = opportunityAdapter.getInitialState({
  loaded: false,
  loading: false,
  pageIndex: 1,
  count: undefined,
  pageSize: 15,
  search: ''
});

export const getEntitiesArray = (entities) => {
  return Object.keys(entities).map(i => entities[i]);
};

export const getOpportunity = (state: OpportunitiesState, pk: String) => {
  const entities = getEntitiesArray(state.entities);
  return entities.find((item) => {
    if (item.pk) {
      return item.pk.toString() === pk;
    }
  });
};

export function reducer(state = initialState, action: opportunitiesActions.All): OpportunitiesState {
  switch (action.type) {
    case opportunitiesActions.LOAD_OPPORTUNITIES_ALL:
    case opportunitiesActions.LOAD_OPPORTUNITY:
      return {
        ...state,
        loading: true,
        loaded: false
      };

    case opportunitiesActions.LOAD_OPPORTUNITIES_ALL_SUCCESS:
      if (action.payload) {
        const previousState = {
          ...state,
          loaded: true,
          loading: false,
          count: +action.payload.count,
        };
        const listState = opportunityAdapter.addAll(action.payload.results, previousState);
        for (const item of action.payload.results) {
          listState.entities[item.pk] = item;
        }
        return listState;
      }
      return {
        ...state,
        loading: false,
        loaded: true,
      };

    case opportunitiesActions.LOAD_OPPORTUNITY_SUCCESS:
    case opportunitiesActions.APPLY_OPPORTUNITY_SUCCESS:
      const oldState = {
        ...state,
        loaded: true,
        loading: false
      };
      const newState = opportunityAdapter.upsertOne(action.payload, oldState);
      newState.entities[action.payload.pk] = action.payload;
      return newState;

    case opportunitiesActions.LOAD_OPPORTUNITIES_ALL_FAIL:
    case opportunitiesActions.LOAD_OPPORTUNITY_FAIL:
      return {
        ...state,
        loaded: true,
        loading: false
      };

    case opportunitiesActions.SET_PAGINATION:
      return {... state, pageIndex: action.payload.pageIndex, pageSize: action.payload.pageSize};

    case opportunitiesActions.SEARCH:
      return {...state, search: action.payload };

    default:
      return state;
  }
}

export const opportunityEmptyMoment = (state: OpportunitiesState) => {
  return state.loaded && !state.loading && state.ids.length === 0;
};

export const opportunityIsLoading = (state: OpportunitiesState) => {
  return state.loading;
};

export const selectPageSize = (state: OpportunitiesState) => state.pageSize;
export const selectPageIndex = (state: OpportunitiesState) =>  state.pageIndex - 1;
export const selectCount = (state: OpportunitiesState) => state.count;
export const selectSearch = (state: OpportunitiesState) => state.search;
export const isLoading = (state: OpportunitiesState) => state.loading;
export const emptyMoment = (state: OpportunitiesState) => state.loaded && !state.loading && state.ids.length === 0;
export const {
  selectAll,
} = opportunityAdapter.getSelectors();
