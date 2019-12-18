import { OpportunityModel } from '../../models/opportunity.model';
import * as actionOpportunities from './opportunities.action';

const payload = {
  items: [],
  loading: false
};

describe('Opportunities Actions', () => {
  it('Should create a Load Projects action', () => {
    const action = new actionOpportunities.LoadOpportunities();

    expect({ ...action }).toEqual({
      type: actionOpportunities.LOAD_OPPORTUNITIES_ALL
    });
  });

  it('Should create a Load Project Success action', () => {
    const opp: OpportunityModel[] = [new OpportunityModel('390'), new OpportunityModel('391')];
    const data = {
      results: opp,
      count: '1',
      next: '',
      previous: ''
    };
    const action = new actionOpportunities.LoadOpportunitiesSuccess(data);

    expect( { ...action }).toEqual({
      type: actionOpportunities.LOAD_OPPORTUNITIES_ALL_SUCCESS,
      payload: data
    });
  });

  it('Should create a Load Projects Fail action', () => {
    const action = new actionOpportunities.LoadOpportunitiesFail(payload);

    expect({ ...action }).toEqual({
      type: actionOpportunities.LOAD_OPPORTUNITIES_ALL_FAIL,
      payload
    });
  });

  it('Should create a CreateOpportunity action', () => {
    const action = new actionOpportunities.CreateOpportunity({
      data: {}, baseUrls: {list: '', viewDetails: ''}
    });

    expect( { ...action }).toEqual({
      type: actionOpportunities.CREATE_OPPORTUNITY,
      payload: {
        data: {}, baseUrls: {list: '', viewDetails: ''}
      }
    });
  });

  it('Should create a CreateOpportunitySuccess action', () => {
    const opportunity: OpportunityModel = new OpportunityModel({});
    const action = new actionOpportunities.CreateOpportunitySuccess(opportunity);

    expect( { ...action }).toEqual({
      type: actionOpportunities.CREATE_OPPORTUNITY_SUCCESS,
      payload: opportunity
    });
  });

  it('Should create a CreateOpportunityFail action', () => {
    const action = new actionOpportunities.CreateOpportunityFail({});

    expect( { ...action }).toEqual({
      type: actionOpportunities.CREATE_OPPORTUNITY_FAIL,
      payload: {}
    });
  });

  it('Should create a PreviewOpportunity action', () => {
    const action = new actionOpportunities.PreviewOpportunity({
      data: {}, baseUrls: {list: '', viewDetails: ''}
    });

    expect( { ...action }).toEqual({
      type: actionOpportunities.PREVIEW_OPPORTUNITY,
      payload: {data: {}, baseUrls: {list: '', viewDetails: ''}}
    });
  });

  it('Should create a PreviewOpportunitySuccess action', () => {
    const opportunity: OpportunityModel = new OpportunityModel({});
    const action = new actionOpportunities.PreviewOpportunitySuccess(opportunity);

    expect( { ...action }).toEqual({
      type: actionOpportunities.PREVIEW_OPPORTUNITY_SUCCESS,
      payload: opportunity
    });
  });

  it('Should create a PreviewOpportunityFail action', () => {
    const action = new actionOpportunities.PreviewOpportunityFail({});

    expect( { ...action }).toEqual({
      type: actionOpportunities.PREVIEW_OPPORTUNITY_FAIL,
      payload: {}
    });
  });

  it('Should create a ApplyOpportunity action', () => {
    const action = new actionOpportunities.ApplyOpportunity({
      pkOpportunity: 1,
      dataToSend: {comment: 'none'}
    });

    expect( { ...action }).toEqual({
      type: actionOpportunities.APPLY_OPPORTUNITY,
      payload: {
        pkOpportunity: 1,
        dataToSend: {comment: 'none'}
      }
    });
  });

  it('Should create a ApplyOpportunitySuccess action', () => {
    const opportunity: OpportunityModel = new OpportunityModel({});
    const action = new actionOpportunities.ApplyOpportunitySuccess(opportunity);

    expect( { ...action }).toEqual({
      type: actionOpportunities.APPLY_OPPORTUNITY_SUCCESS,
      payload: opportunity
    });
  });

  it('Should create a ApplyOpportunityFail action', () => {
    const action = new actionOpportunities.ApplyOpportunityFail({});

    expect( { ...action }).toEqual({
      type: actionOpportunities.APPLY_OPPORTUNITY_FAIL,
      payload: {}
    });
  });

  it('Should create a DeleteOpportunity action', () => {
    const action = new actionOpportunities.DeleteOpportunity(
      {pkOpportunity: 3, urlToNavigate: '', message: 'message'}
    );

    expect( { ...action }).toEqual({
      type: actionOpportunities.DELETE_OPPORTUNITY,
      payload: {pkOpportunity: 3, urlToNavigate: '', message: 'message'}
    });
  });

  it('Should create a DeleteOpportunitySuccess action', () => {
    const action = new actionOpportunities.DeleteOpportunitySuccess(1);

    expect( { ...action }).toEqual({
      type: actionOpportunities.DELETE_OPPORTUNITY_SUCCESS,
      pkOpportunity: 1
    });
  });

  it('Should create a DeleteOpportunity action', () => {
    const action = new actionOpportunities.DeleteOpportunityFail();

    expect( { ...action }).toEqual({
      type: actionOpportunities.DELETE_OPPORTUNITY_FAIL
    });
  });

  it('Should create a EditOpportunity action', () => {
    const action = new actionOpportunities.EditOpportunity({opportunityPk: 3, data: {}, baseUrlViewDetails: ''});

    expect( { ...action }).toEqual({
      type: actionOpportunities.EDIT_OPPORTUNITY,
      payload: {opportunityPk: 3, data: {}, baseUrlViewDetails: ''}
    });
  });

  it('Should create a EditOpportunitySuccess action', () => {
    const opportunity: OpportunityModel = new OpportunityModel({});
    const action = new actionOpportunities.EditOpportunitySuccess(opportunity);

    expect( { ...action }).toEqual({
      type: actionOpportunities.EDIT_OPPORTUNITY_SUCCESS,
      payload: opportunity
    });
  });

  it('Should create a EditOpportunity action', () => {
    const opportunity: OpportunityModel = new OpportunityModel({});
    const action = new actionOpportunities.EditOpportunityFail(opportunity);

    expect( { ...action }).toEqual({
      type: actionOpportunities.EDIT_OPPORTUNITY_FAIL,
      payload: opportunity
    });
  });

});
