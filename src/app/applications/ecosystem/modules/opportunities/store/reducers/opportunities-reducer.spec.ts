import * as MomentTZ from 'moment-timezone';

import { OpportunityModel } from '../../models/opportunity.model';
import * as fromAdminOpportunities from './opportunities-admin.reducers';
import * as fromOpportunities from './opportunities.reducers';
import * as actionsOpportunities from '../actions/opportunities.action';
import { OpportunitiesAdminState } from './opportunities-admin.reducers';
import { OpportunitiesState } from './opportunities.reducers';

describe('OpportunitiesAdminReducer', () => {

  const initialState: OpportunitiesState = {
    ids: [],
    entities: {},
    pageIndex: 1,
    count: undefined,
    pageSize: 15,
    search: '',
    loading: false,
    loaded: false,
  };

  const initialAdminState: OpportunitiesAdminState = {
    ids: [],
    entities: {},
    pageIndex: 1,
    count: undefined,
    pageSize: 5,
    search: '',
    applicantsSelected: [],
    loading: false,
    loaded: false,
  };

  const op1 = new OpportunityModel('390');
  op1.pk = 1;
  op1.created = MomentTZ('2018-12-13T11:33:48+00:00');
  const op2 = new OpportunityModel('391');
  op2.pk = 2;
  op2.created = MomentTZ('2018-11-22T11:55:48+00:00');
  const opportunities = [op1, op2];

  it('Should return the default state', () => {
    const action = {} as any;
    const state = fromOpportunities.reducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('Should set loading to true', () => {
    const action = new actionsOpportunities.LoadOpportunities();
    const state = fromOpportunities.reducer(initialState, action);

    expect(state.loading).toEqual(true);
  });

  it('Should set loading to false and loaded true and populate data', () => {
    const action = new actionsOpportunities.LoadOpportunitiesSuccess({
      results: opportunities,
      count: '1',
      next: '',
      previous: ''
    });
    const state = fromOpportunities.reducer(initialState, action);

    expect(state.loading).toEqual(false);
    expect(state.loaded).toEqual(true);
  });

  it('Should add an opportunity to the store after LoadOpportunitySuccess', () => {
    const action = new actionsOpportunities.LoadOpportunitySuccess(op1);
    const state = fromAdminOpportunities.reducer(initialAdminState, action);
    expect(state.entities['1']).toBe(op1);
  });

  it('Should add an opportunity to the store after CreateOpportunitySuccess', () => {
    const action = new actionsOpportunities.CreateOpportunitySuccess(op1);
    const state = fromAdminOpportunities.reducer(initialAdminState, action);
    expect(state.entities['1']).toBe(op1);
  });
});
