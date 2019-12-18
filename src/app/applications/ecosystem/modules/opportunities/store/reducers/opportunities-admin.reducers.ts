import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { OpportunityModel } from '../../models/opportunity.model';
import { OpportunityApplicantModel } from '../../models/opportunity-applicant.model';
import * as opportunitiesActions from '../actions/opportunities.action';
import * as opportunitiesAdminActions from '../../modules/admin/store/actions/opportunities-admin.action';


export interface OpportunitiesAdminState extends EntityState<OpportunityModel> {
  loading: boolean;
  loaded: boolean;
  pageIndex: number | undefined;
  count: number | undefined;
  pageSize: number | undefined;
  search: string;
  applicantsSelected: OpportunityApplicantModel[];
}

export const opportunityAdapter: EntityAdapter<OpportunityModel> =
  createEntityAdapter<OpportunityModel>({
    selectId: (opportunity: OpportunityModel) => opportunity.pk
  });


export const initialState: OpportunitiesAdminState = opportunityAdapter.getInitialState({
  loaded: false,
  loading: false,
  pageIndex: 1,
  count: undefined,
  pageSize: 5,
  search: '',
  applicantsSelected: [],
});

// Return applicant selected or undefined
const findSelectedApplicants = (applicants: any[]) => {
  if (applicants) {
    return applicants.filter((applicant: OpportunityApplicantModel) => {
      return applicant.isSelected();
    });
  }
  return [];
};


export const getEntitiesArray = (entities) => {
  return Object.keys(entities).map(i => entities[i]);
};

export const getOpportunity = (state: OpportunitiesAdminState, pk: String) => {
  const entities = getEntitiesArray(state.entities);
  return entities.find((item) => {
    if (item.pk) {
      return item.pk.toString() === pk;
    }
  });
};

type combineOpportunitiesactions = opportunitiesActions.All | opportunitiesAdminActions.All;

export function reducer(state = initialState, action: combineOpportunitiesactions): OpportunitiesAdminState {
  switch (action.type) {
    case opportunitiesActions.LOAD_OPPORTUNITIES_BY_YOU:
    case opportunitiesActions.LOAD_ADVISORY_CALL:
    case opportunitiesAdminActions.LOAD_OPPORTUNITY_ADMIN:
    case opportunitiesActions.LOAD_OPPORTUNITY:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case opportunitiesActions.LOAD_OPPORTUNITIES_BY_YOU_SUCCESS:
    case opportunitiesActions.LOAD_ADVISORY_CALL_SUCCESS:
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

    case opportunitiesActions.CREATE_OPPORTUNITY_SUCCESS:
        const oldCreationState = {
          ...state,
          loaded: true,
          loading: false,
          count: state.count + 1,
          applicantsSelected: findSelectedApplicants(action.payload.applicants)
        };
        const newCreationState = opportunityAdapter.upsertOne(action.payload, oldCreationState);
        newCreationState.entities[action.payload.pk] = action.payload;
        return newCreationState;
    case opportunitiesActions.LOAD_OPPORTUNITY_SUCCESS:
    case opportunitiesAdminActions.LOAD_OPPORTUNITY_ADMIN_SUCCESS:
    case opportunitiesAdminActions.CLOSE_OPPORTUNITY_SUCCESS:
    case opportunitiesAdminActions.REOPEN_OPPORTUNITY_SUCCESS:
      const oldState = {
        ...state,
        loaded: true,
        loading: false,
        applicantsSelected: findSelectedApplicants(action.payload.applicants)
      };
      const newState = opportunityAdapter.upsertOne(action.payload, oldState);
      newState.entities[action.payload.pk] = action.payload;
      return newState;

    case opportunitiesActions.EDIT_OPPORTUNITY_SUCCESS:
      const oldEditState = {
        ...state,
        loaded: true,
        loading: false,
        applicantsSelected: findSelectedApplicants(action.payload.applicants)
      };

      // Applicant aren't sent again so keep the same previously.
      const oldOpportunity = getOpportunity(oldEditState, action.payload.pk.toString());
      const newOpportunity = action.payload;
      newOpportunity.applicants = oldOpportunity.applicants;
      const newEditState = opportunityAdapter.upsertOne(newOpportunity, oldEditState);
      newEditState.entities[action.payload.pk] = newOpportunity;
      return newEditState;

    case opportunitiesActions.LOAD_OPPORTUNITIES_BY_YOU_FAIL:
    case opportunitiesActions.LOAD_OPPORTUNITY_FAIL:
      return {
        ...state,
        loaded: true,
        loading: false
      };

    case opportunitiesAdminActions.OPPORTUNITY_SELECT_APPLICANT_SUCCESS:
      const oldApplyState = {
        ...state,
        loaded: true,
        loading: false,
        applicantsSelected: findSelectedApplicants(action.payload.opportunity.applicants)
      };
      const newApplyState = opportunityAdapter.upsertOne(action.payload.opportunity, oldApplyState);
      newApplyState.entities[action.payload.opportunity.pk] = action.payload.opportunity;
      return newApplyState;

    case opportunitiesAdminActions.OPPORTUNITY_REJECT_APPLICANT_SUCCESS:
      const oldRejectState = {
        ...state,
        loaded: true,
        loading: false,
        applicantsSelected: findSelectedApplicants(action.payload.applicants)
      };
      const newRejectState = opportunityAdapter.upsertOne(action.payload, oldRejectState);
      newRejectState.entities[action.payload.pk] = action.payload;
      return newRejectState;

    case opportunitiesActions.DELETE_OPPORTUNITY_SUCCESS:
      return opportunityAdapter.removeOne(action.pkOpportunity, {
        ...state,
        loading: false,
        count: state.count - 1,
      });

    case opportunitiesActions.SET_PAGINATION_ADMIN:
      return {
        ... state,
        pageIndex: action.payload.pageIndex,
        pageSize: action.payload.pageSize
      };

    case opportunitiesActions.SEARCH_ADMIN:
      return {...state, search: action.payload };

    default:
      return state;
  }
}

export const selectPageSize = (state: OpportunitiesAdminState) => state.pageSize;
export const selectPageIndex = (state: OpportunitiesAdminState) =>  state.pageIndex - 1;
export const selectCount = (state: OpportunitiesAdminState) => state.count;
export const selectSearch = (state: OpportunitiesAdminState) => state.search;
export const isLoading = (state: OpportunitiesAdminState) => state.loading;
export const emptyMoment = (state: OpportunitiesAdminState) => state.loaded && !state.loading && state.ids.length === 0;
export const getApplicantsSelected = (state: OpportunitiesAdminState) => state.applicantsSelected;
export const {
  selectAll,
} = opportunityAdapter.getSelectors();
