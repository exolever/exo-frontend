import { Action } from '@ngrx/store';
import { Survey, SurveyResultsInterface } from './exq.model';
import { PaginationModel } from '@applications/shared/models';

export const LOAD_SURVEYS = '[ExQ] Load surveys';
export const LOAD_SURVEYS_SUCCESS = '[ExQ] Load surveys SUCCESS';
export const LOAD_SURVEYS_FAIL = '[ExQ] Load surveys FAIL';
export const LOAD_SURVEY = '[ExQ] Load survey';
export const LOAD_SURVEY_SUCCESS = '[ExQ] Load survey SUCCESS';
export const LOAD_SURVEY_FAIL = '[ExQ] Load survey FAIL';
export const ADD_SURVEY = '[ExQ] Add new survey';
export const ADD_SURVEY_SUCCESS = '[ExQ] Add new survey SUCCESS';
export const ADD_SURVEY_FAIL = '[ExQ] Add new survey FAIL';
export const UPDATE_SURVEY = '[ExQ] Update new survey';
export const UPDATE_SURVEY_SUCCESS = '[ExQ] Update new survey SUCCESS';
export const UPDATE_SURVEY_FAIL = '[ExQ] Update new survey FAIL';
export const DELETE_SURVEY = '[ExQ] Delete survey';
export const DELETE_SURVEY_SUCCESS = '[ExQ] Delete survey SUCCESS';
export const DELETE_SURVEY_FAIL = '[ExQ] Delete survey FAIL';
export const GET_SURVEY_RESULTS = '[ExQ] Get results';
export const GET_SURVEY_RESULTS_SUCCESS = '[ExQ] Get suvey results SUCCESS';
export const GET_SURVEY_RESULTS_FAIL = '[ExQ] Get survey results FAIL';
export const PAGINATE = '[ExQ] Paginate';
export const SEARCH_TERMS = '[ExQ] Set search terms';
export const SEARCH = '[ExQ] Search';
export const SEARCH_SUCCESS = '[ExQ] Search Success';
export const PAGINATE_RESULT = '[ExQ] Paginate Results';
export const SEARCH_TERMS_RESULT = '[ExQ] Search term result';
export const DELETE_RESULT = '[ExQ] Delete result';
export const DELETE_RESULT_SUCCESS = '[ExQ] Delete result SUCCESS';


export class Search implements Action {
  readonly type = SEARCH;
  constructor() { }
}

export class SearchSuccess implements Action {
  readonly type = SEARCH_SUCCESS;
  constructor(public payload: PaginationModel<Survey>) { }
}

export class LoadSurveys implements Action {
  readonly type = LOAD_SURVEYS;
  constructor(public payload: PaginationModel<Survey>) { }
}

export class LoadSurveysSuccess implements Action {
  readonly type = LOAD_SURVEYS_SUCCESS;
  constructor(public payload: PaginationModel<Survey>) {}
}

export class LoadSurveysFail implements Action {
  readonly type = LOAD_SURVEYS_FAIL;
  constructor(public payload: any) {}
}

export class LoadSurvey implements Action {
  readonly type = LOAD_SURVEY;
  constructor(public payload: number) {}
}

export class LoadSurveySuccess implements Action {
  readonly type = LOAD_SURVEY_SUCCESS;
  constructor(public payload: Survey) {}
}

export class LoadSurveyFail implements Action {
  readonly type = LOAD_SURVEY_FAIL;
  constructor(public payload: any) {}
}

export class AddSurvey implements Action {
  readonly type = ADD_SURVEY;
  constructor(public payload: any) {}
}

export class AddSurveySuccess implements Action {
  readonly type = ADD_SURVEY_SUCCESS;
  constructor(public payload: Survey) {}
}

export class AddSurveyFail implements Action {
  readonly type = ADD_SURVEY_FAIL;
  constructor(public payload: any) {}
}

export class UpdateSurvey implements Action {
  readonly type = UPDATE_SURVEY;
  constructor(public payload: { pk: number, data: any }) {
  }
}

export class UpdateSurveySuccess implements Action {
  readonly type = UPDATE_SURVEY_SUCCESS;
  constructor(public payload: Survey) {}
}

export class UpdateSurveyFail implements Action {
  readonly type = UPDATE_SURVEY_FAIL;
  constructor(public payload: any) {}
}

export class DeleteSurvey implements Action {
  readonly type = DELETE_SURVEY;
  constructor(public payload: { pk: number }) {
  }
}

export class DeleteSurveySuccess implements Action {
  readonly type = DELETE_SURVEY_SUCCESS;
  constructor(public payload: { pk: number }) {
  }
}

export class DeleteSurveyFail implements Action {
  readonly type = DELETE_SURVEY_FAIL;
  constructor(public payload: any) {}
}

export class GetSurveyResults implements Action {
  readonly type = GET_SURVEY_RESULTS;
  constructor(public payload: number) {}
}

export class GetSurveyResultsSuccess implements Action {
  readonly type = GET_SURVEY_RESULTS_SUCCESS;
  constructor(public payload: {pk: number, results: SurveyResultsInterface[]}) {}
}

export class GetSurveyResultsFail implements Action {
  readonly type = GET_SURVEY_RESULTS_FAIL;
  constructor(public payload: any) {}
}
export class Paginate implements Action {
  readonly type = PAGINATE;
  constructor(public payload: {pageSize: number, pageIndex: number}) { }
}
export class SetSearchTerms implements Action {
  readonly type = SEARCH_TERMS;
  constructor(public payload: string) {}
}

export class PaginateResult implements Action {
  readonly type = PAGINATE_RESULT;
  constructor(public payload: {pageSize: number, pageIndex: number, pkSurvey: number}) { }
}
export class SetSearchTermsResult implements Action {
  readonly type = SEARCH_TERMS_RESULT;
  constructor(public payload: {term: string, pkSurvey: number}) {}
}

export class DeleteResultSuccess implements Action {
  readonly type = DELETE_RESULT_SUCCESS;
  constructor(public payload: { pkResult: number, pkSurvey: number }) {
  }
}

export class DeleteResult implements Action {
  readonly type = DELETE_RESULT;
  constructor(public payload: { pkResult: number, pkSurvey: number }) {}
}


export type SurveyActions =
  | LoadSurveys
  | LoadSurveysSuccess
  | LoadSurveysFail
  | LoadSurvey
  | LoadSurveySuccess
  | LoadSurveyFail
  | AddSurvey
  | AddSurveySuccess
  | AddSurveyFail
  | UpdateSurvey
  | UpdateSurveySuccess
  | UpdateSurveyFail
  | DeleteSurvey
  | DeleteSurveySuccess
  | DeleteSurveyFail
  | GetSurveyResults
  | GetSurveyResultsSuccess
  | GetSurveyResultsFail
  | Paginate
  | Search
  | SearchSuccess
  | SetSearchTerms
  | PaginateResult
  | SetSearchTermsResult
  | DeleteResultSuccess
  | DeleteResult
;
