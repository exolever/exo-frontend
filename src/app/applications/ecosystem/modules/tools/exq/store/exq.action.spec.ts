import { FakeSurveyFactory } from './exqFake.model';
import * as actionSurveys from './exq.action';

describe('ExQ Actions', () => {

  it('Should create a Load Surveys Fail action', () => {
    const action = new actionSurveys.LoadSurveysFail({});
    expect({ ...action }).toEqual({
      type: actionSurveys.LOAD_SURVEYS_FAIL,
      payload: {}
    });
  });

  it('Should create a Load survey action', () => {
    const action = new actionSurveys.LoadSurvey(1);
    expect({ ...action }).toEqual({
      type: actionSurveys.LOAD_SURVEY,
      payload: 1
    });
  });

  it('Should create a Load Survey Success action', () => {
    const survey = new FakeSurveyFactory().modelPropertiesCustom();
    const action = new actionSurveys.LoadSurveySuccess(survey);
    expect( { ...action }).toEqual({
      type: actionSurveys.LOAD_SURVEY_SUCCESS,
      payload: survey
    });
  });

  it('Should create a Load Survey Fail action', () => {
    const action = new actionSurveys.LoadSurveyFail({});
    expect({ ...action }).toEqual({
      type: actionSurveys.LOAD_SURVEY_FAIL,
      payload: {}
    });
  });

  it('Should create a Add Survey action', () => {
    const data = {name: 'name'};
    const action = new actionSurveys.AddSurvey(data);
    expect( { ...action }).toEqual({
      type: actionSurveys.ADD_SURVEY,
      payload: data
    });
  });

  it('Should create a Add Survey Success action', () => {
    const survey = new FakeSurveyFactory().modelPropertiesCustom();
    const action = new actionSurveys.AddSurveySuccess(survey);
    expect( { ...action }).toEqual({
      type: actionSurveys.ADD_SURVEY_SUCCESS,
      payload: survey
    });
  });

  it('Should create a Add Survey Fail action', () => {
    const action = new actionSurveys.AddSurveyFail({});
    expect({ ...action }).toEqual({
      type: actionSurveys.ADD_SURVEY_FAIL,
      payload: {}
    });
  });

  it('Should create a Update Survey action', () => {
    const data = {pk: 1, data: {name: 'name'}};
    const action = new actionSurveys.UpdateSurvey(data);
    expect( { ...action }).toEqual({
      type: actionSurveys.UPDATE_SURVEY,
      payload: data
    });
  });

  it('Should create a Update Survey Success action', () => {
    const survey = new FakeSurveyFactory().modelPropertiesCustom();
    const action = new actionSurveys.UpdateSurveySuccess(survey);
    expect( { ...action }).toEqual({
      type: actionSurveys.UPDATE_SURVEY_SUCCESS,
      payload: survey
    });
  });

  it('Should create a Update Survey Fail action', () => {
    const action = new actionSurveys.UpdateSurveyFail({});
    expect({ ...action }).toEqual({
      type: actionSurveys.UPDATE_SURVEY_FAIL,
      payload: {}
    });
  });

  it('Should create a Delete Survey action', () => {
    const data = {pk: 1};
    const action = new actionSurveys.DeleteSurvey(data);
    expect( { ...action }).toEqual({
      type: actionSurveys.DELETE_SURVEY,
      payload: data
    });
  });

  it('Should create a Delete Survey Success action', () => {
    const data = {pk: 1};
    const action = new actionSurveys.DeleteSurveySuccess(data);
    expect( { ...action }).toEqual({
      type: actionSurveys.DELETE_SURVEY_SUCCESS,
      payload: data
    });
  });

  it('Should create a Delete Survey Fail action', () => {
    const action = new actionSurveys.DeleteSurveyFail({});
    expect({ ...action }).toEqual({
      type: actionSurveys.DELETE_SURVEY_FAIL,
      payload: {}
    });
  });

  it('Should create a Get Survey results action', () => {
    const action = new actionSurveys.GetSurveyResults(1);
    expect( { ...action }).toEqual({
      type: actionSurveys.GET_SURVEY_RESULTS,
      payload: 1
    });
  });

  it('Should create a Get Survey results Success action', () => {
    const survey = new FakeSurveyFactory().modelPropertiesCustom();
    const data = {pk: 1, results: survey.results};
    const action = new actionSurveys.GetSurveyResultsSuccess(data);
    expect( { ...action }).toEqual({
      type: actionSurveys.GET_SURVEY_RESULTS_SUCCESS,
      payload: data
    });
  });

  it('Should create a Get Survey results Fail action', () => {
    const action = new actionSurveys.GetSurveyResultsFail({});
    expect({ ...action }).toEqual({
      type: actionSurveys.GET_SURVEY_RESULTS_FAIL,
      payload: {}
    });
  });

});
