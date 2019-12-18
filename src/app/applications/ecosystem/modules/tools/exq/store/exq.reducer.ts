import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppState } from '@core/store/reducers';

import { Results, ResultsInitialState, Survey } from './exq.model';
import * as fromActions from './exq.action';
import * as MomentTZ from 'moment-timezone';

export interface SurveyState extends EntityState<Survey> {
  loading: boolean;
  name: string;
  pk: number;
  searchTerms: string;
  pageSize: number;
  page: number;
  surveys: Survey[];
  totalSurveys: number;
  results: Results;
}

const sortByCreatedDate = (a: Survey, b: Survey) => {
  b['created'] = MomentTZ(b['created']);
  a['created'] = MomentTZ(a['created']);
  if ( b['created'] && a['created']
    && b['created'].constructor.name === 'Moment'
    && a['created'].constructor.name === 'Moment' ) {
    return b['created'].toISOString() > a['created'].toISOString() ?
      1 : b['created'].toISOString() < a['created'].toISOString() ? -1 : 0;
  }
};

const surveyAdapter: EntityAdapter<Survey> =
  createEntityAdapter<Survey>({
    selectId: (s: Survey) => s.pk,
    sortComparer: sortByCreatedDate
  });

const initialState: SurveyState = surveyAdapter.getInitialState({
  loading: false,
  name: undefined,
  pk: undefined,
  searchTerms: '',
  pageSize: 10,
  page: 1,
  surveys: undefined,
  totalSurveys: undefined,
  results: ResultsInitialState
});


const getSurvey = (state: SurveyState, pk: number) => {
  const entities = Object.keys(state.entities).map(i => state.entities[i]);
  return entities.find((item) => item.pk === pk);
};

const removeResult = (state: SurveyState, payload: { pkSurvey: number; pkResult: number }) => {
  const newResultSet = state.entities[payload.pkSurvey].results.filter(r => r.pk !== payload.pkResult);
  state.entities[payload.pkSurvey].results = newResultSet;
  return state;
};

export function reducer(
  state = initialState, action: fromActions.SurveyActions
): SurveyState {
  switch ( action.type ) {
    case fromActions.LOAD_SURVEYS:
    case fromActions.LOAD_SURVEY:
      return {...state, loading: true};
    case fromActions.LOAD_SURVEYS_SUCCESS:
      return surveyAdapter.addAll(action.payload.results, {
        ...state,
        surveys: action.payload.results,
        totalSurveys: action.payload.count,
        loading: false,
        name: undefined,
        pk: undefined,
      });
    case fromActions.LOAD_SURVEY_SUCCESS:
      const oldState = {...state, loading: false};
      const newState = surveyAdapter.upsertOne(action.payload, oldState);
      newState.results.totalResults = action.payload.totalAnswers;
      newState.entities[action.payload.pk] = action.payload;
      return newState;
    case fromActions.LOAD_SURVEYS_FAIL:
      return {...state, loading: false};
    case fromActions.ADD_SURVEY_SUCCESS:
      return surveyAdapter.addOne(action.payload, state);
    case fromActions.DELETE_SURVEY_SUCCESS:
      return surveyAdapter.removeOne(action.payload.pk, {...state});
    case fromActions.UPDATE_SURVEY_SUCCESS:
      return surveyAdapter.upsertOne(action.payload, state);
    case fromActions.GET_SURVEY_RESULTS_SUCCESS:
      const selectedSurvey = getSurvey(state, action.payload.pk);
      selectedSurvey.results = action.payload.results;
      state.results.totalResults = action.payload.results.length;
      return surveyAdapter.upsertOne(selectedSurvey, state);
    case fromActions.PAGINATE:
      return {
        ...state,
        page: action.payload.pageIndex,
        pageSize: action.payload.pageSize
      };
    case fromActions.SEARCH_TERMS:
      return {
        ...state,
        page: 1,
        searchTerms: action.payload
      };
    case fromActions.PAGINATE_RESULT:
      return {
        ...state,
        results: {
          ...(state.results),
          page: action.payload.pageIndex,
          pageSize: action.payload.pageSize
        },
      };
    case fromActions.SEARCH_TERMS_RESULT:
      return {
        ...state,
        results: {
          ...(state.results),
          page: 1,
          searchTerms: action.payload.term
        },
      };
    case fromActions.DELETE_RESULT_SUCCESS:
      return removeResult(state, action.payload);
    default:
      return state;
  }
}


export const selectSurveyState = createFeatureSelector<SurveyState>('surveys');

// tslint:disable-next-line
const {selectEntities, selectAll} = surveyAdapter.getSelectors();

export const getAll = createSelector(selectSurveyState, selectAll);

export const selectSurveysEntities = createSelector(
  selectSurveyState,
  selectEntities
);

export function isLoading(state: AppState): boolean {
  return state.surveys.loading;
}

export function loadedWithoutContent(state: AppState): boolean {
  return state.surveys.loading === false && Object.keys(state.surveys.entities).length === 0;
}

export const selectSurvey = (state: SurveyState, pk: number) => {
  return getSurvey(state, pk);
};

export function getPage(state: AppState) {
  return state.surveys.page;
}

export function getPageSize(state: AppState) {
  return state.surveys.pageSize;
}

export function getResults(state: AppState) {
  const ids: any = state.surveys.ids;
  return ids.map(key => state.surveys.entities[key]);
}

export function getTotalResults(state: AppState) {
  return state.surveys.totalSurveys;
}

export function getQueryParams(state: AppState) {
  return {
    searchTerms: state.surveys.searchTerms,
    page: state.surveys.page,
    pageSize: state.surveys.pageSize
  };
}

export function getQueryParamsResult(state: AppState) {
  return {
    searchTerms: state.surveys.results.searchTerms,
    page: state.surveys.results.page,
    pageSize: state.surveys.results.pageSize
  };
}

export function getTerms(state: AppState) {
  return state.surveys.searchTerms;
}

export function getResultPage(state: AppState) {
  return state.surveys.results.page;
}

export function getResultPageSize(state: AppState) {
  return state.surveys.results.pageSize;
}

export function getResultTotalResults(state: AppState) {
  return state.surveys.results.totalResults;
}

export function getResultTerms(state: AppState) {
  return state.surveys.results.searchTerms;
}

