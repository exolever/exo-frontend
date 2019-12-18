import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';
import { FakeOpportunityApplicantFactory } from '@opportunities/faker_factories/opportunityApplicantFake.model';
import { FakeOpportunityFactory } from '@opportunities/faker_factories/opportunityFake.model';

import * as adminActions from './opportunities-admin.action';


describe('OpportunitiesAdminActions', () => {
  it('Should create a LOAD_OPPORTUNITY_ADMIN action', () => {
    const action = new adminActions.LoadOpportunityAdmin('3');

    expect({ ...action }).toEqual({
      type: adminActions.LOAD_OPPORTUNITY_ADMIN,
      pk: '3'
    });
  });

  it('Should create a LOAD_OPPORTUNITY_ADMIN_FAIL action', () => {
    const action = new adminActions.LoadOpportunityAdminFail({ message: 'Error' });

    expect({ ...action }).toEqual({
      type: adminActions.LOAD_OPPORTUNITY_ADMIN_FAIL,
      payload: { message: 'Error' }
    });
  });

  it('Should create a LOAD_OPPORTUNITY_ADMIN_SUCCESS action', () => {
    const opportunity: OpportunityModel = new OpportunityModel({});
    const action = new adminActions.LoadOpportunityAdminSuccess(opportunity);

    expect({ ...action }).toEqual({
      type: adminActions.LOAD_OPPORTUNITY_ADMIN_SUCCESS,
      payload: opportunity
    });
  });

  it('Should create a OPPORTUNITY_SELECT_APPLICANT action', () => {
    const applicant = new FakeOpportunityApplicantFactory();
    const message = 'message';
    const action = new adminActions.OpportunitySelectAplicant(
      { applicant: applicant, sow: {}, message: message }
    );

    expect({ ...action }).toEqual({
      type: adminActions.OPPORTUNITY_SELECT_APPLICANT,
      payload: {
        applicant: applicant,
        sow: {},
        message: message
      }
    });
  });

  it('Should create a OPPORTUNITY_SELECT_APPLICANT_SUCCESS action', () => {
    const opportunity = new FakeOpportunityFactory();
    const opportunityApplicant = new FakeOpportunityApplicantFactory();
    const action = new adminActions.OpportunitySelectApplicantSuccess(
      {opportunity: opportunity, applicant: opportunityApplicant}
    );

    expect({ ...action }).toEqual({
      type: adminActions.OPPORTUNITY_SELECT_APPLICANT_SUCCESS,
      payload: {opportunity: opportunity, applicant: opportunityApplicant}
    });
  });

  it('Should create a OPPORTUNITY_SELECT_APPLICANT_FAIL action', () => {
    const action = new adminActions.OpportunitySelectApplicantFail({});

    expect({ ...action }).toEqual({
      type: adminActions.OPPORTUNITY_SELECT_APPLICANT_FAIL,
      payload: {}
    });
  });

  it('Should create a CLOSE_OPPORTUNITY action', () => {
    const action = new adminActions.CloseOpportunity({ pk: 3, message: 'string'});

    expect({ ...action }).toEqual({
      type: adminActions.CLOSE_OPPORTUNITY,
      payload: {
        pk: 3,
        message: 'string',
      }
    });
  });

  it('Should create a CLOSE_OPPORTUNITY_SUCCESS action', () => {
    const action = new adminActions.CloseOpportunitySuccess({});

    expect({ ...action }).toEqual({
      type: adminActions.CLOSE_OPPORTUNITY_SUCCESS,
      payload: {}
    });
  });

  it('Should create a CLOSE_OPPORTUNITY_FAIL action', () => {
    const action = new adminActions.CloseOpportunityFail({});

    expect({ ...action }).toEqual({
      type: adminActions.CLOSE_OPPORTUNITY_FAIL,
      payload: {}
    });
  });

  it('Should create a OPPORTUNITY_REJECT_APPLICANT action', () => {
    const applicant = new FakeOpportunityApplicantFactory();
    const message = 'message';
    const action = new adminActions.OpportunityRejectAplicant(
      { applicant: applicant, message: message }
    );

    expect({ ...action }).toEqual({
      type: adminActions.OPPORTUNITY_REJECT_APPLICANT,
      payload: {
        applicant: applicant,
        message: message
      }
    });
  });

  it('Should create a OPPORTUNITY_REJECT_APPLICANT_SUCCESS action', () => {
    const opportunity = new FakeOpportunityFactory();
    const action = new adminActions.OpportunityRejectApplicantSuccess(opportunity);

    expect({ ...action }).toEqual({
      type: adminActions.OPPORTUNITY_REJECT_APPLICANT_SUCCESS,
      payload: opportunity
    });
  });

  it('Should create a OPPORTUNITY_REJECT_APPLICANT_FAIL action', () => {
    const opportunity = new FakeOpportunityFactory();
    const action = new adminActions.OpportunityRejectApplicantFail(opportunity);

    expect({ ...action }).toEqual({
      type: adminActions.OPPORTUNITY_REJECT_APPLICANT_FAIL,
      payload: opportunity
    });
  });

  it('Should create a EDIT_SOW action', () => {
    const applicant = new FakeOpportunityApplicantFactory();
    const message = 'message';
    const sow = applicant.sow;
    const action = new adminActions.EditSow(
      { applicant: applicant,
        sow: sow,
        message: message
      }
    );

    expect({ ...action }).toEqual({
      type: adminActions.EDIT_SOW,
      payload: {
        applicant: applicant,
        sow: sow,
        message: message
      }
    });
  });

  it('Should create a EDIT_SOW_SUCCESS action', () => {
    const action = new adminActions.EditSowSuccess({});

    expect({ ...action }).toEqual({
      type: adminActions.EDIT_SOW_SUCCESS,
      payload: {}
    });
  });

  it('Should create a EDIT_SOW_FAIL action', () => {
    const action = new adminActions.EditSowFail({});

    expect({ ...action }).toEqual({
      type: adminActions.EDIT_SOW_FAIL,
      payload: {}
    });
  });

});
