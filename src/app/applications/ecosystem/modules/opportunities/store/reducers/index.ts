import { createFeatureSelector, createSelector, ActionReducerMap} from '@ngrx/store';

import * as fromOpportunities from './opportunities.reducers';
import * as fromOpportunitiesAdmin from './opportunities-admin.reducers';

export interface OpportunityState {
  opportunities: fromOpportunities.OpportunitiesState;
  opportunitiesAdmin: fromOpportunitiesAdmin.OpportunitiesAdminState;
}

export const reducers: ActionReducerMap<OpportunityState> = {
  opportunities: fromOpportunities.reducer,
  opportunitiesAdmin: fromOpportunitiesAdmin.reducer,
};

// Public selectors for opportunities
const selectOpportunitiesState = createFeatureSelector<fromOpportunities.OpportunitiesState>('opportunities');
export const selectCount = createSelector(selectOpportunitiesState, fromOpportunities.selectCount);
export const selectPageSize = createSelector(selectOpportunitiesState, fromOpportunities.selectPageSize);
export const selectPageIndex = createSelector(selectOpportunitiesState, fromOpportunities.selectPageIndex);
export const selectSearch = createSelector(selectOpportunitiesState, fromOpportunities.selectSearch);
export const selectEmptyMoment = createSelector(selectOpportunitiesState, fromOpportunities.emptyMoment);
export const selectIsLoading = createSelector(selectOpportunitiesState, fromOpportunities.isLoading);
export const selectOpportunities = createSelector(selectOpportunitiesState, fromOpportunities.selectAll);

export const selectOpportunity = (state: fromOpportunities.OpportunitiesState, pk: String) =>
  fromOpportunities.getOpportunity(state, pk);

// Public selectors for opportunities published by you or with admin permissions
const selectOpportunitiesAdminState = createFeatureSelector
  <fromOpportunitiesAdmin.OpportunitiesAdminState>('opportunitiesAdmin');
export const selectAdminCount = createSelector(
  selectOpportunitiesAdminState, fromOpportunitiesAdmin.selectCount);
export const selectAdminPageSize = createSelector(
  selectOpportunitiesAdminState, fromOpportunitiesAdmin.selectPageSize);
export const selectAdminPageIndex = createSelector(
  selectOpportunitiesAdminState, fromOpportunitiesAdmin.selectPageIndex);
export const selectAdminSearch = createSelector(
  selectOpportunitiesAdminState, fromOpportunitiesAdmin.selectSearch);
export const selectAdminEmptyMoment = createSelector(
  selectOpportunitiesAdminState, fromOpportunitiesAdmin.emptyMoment);
export const selectAdminIsLoading = createSelector(
  selectOpportunitiesAdminState, fromOpportunitiesAdmin.isLoading);
export const selectAdminApplicantSelected = createSelector(
  selectOpportunitiesAdminState, fromOpportunitiesAdmin.getApplicantsSelected);
export const selectOpportunitiesAdmin = createSelector(selectOpportunitiesAdminState, fromOpportunitiesAdmin.selectAll);


export const selectOpportunityAdmin = (state: fromOpportunitiesAdmin.OpportunitiesAdminState, pk: String) =>
  fromOpportunitiesAdmin.getOpportunity(state, pk);
