import * as fromQuestions from './questions.reducer';
import * as fromAnswers from './answers.reducer';
import * as fromSessions from './sessions.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface SwarmSessionsState {
  sessions: fromSessions.SessionsState;
  questions: fromQuestions.QuestionsState;
  answers: fromAnswers.AnswersState;
}

export const reducers: ActionReducerMap<SwarmSessionsState> = {
  sessions: fromSessions.reducer,
  questions: fromQuestions.reducer,
  answers: fromAnswers.reducer
};

// Public selectors for questions
const selectQuestionsState = createFeatureSelector<fromQuestions.QuestionsState>('questions');
export const selectQuestionsIds = createSelector(selectQuestionsState, fromQuestions.selectIds);
export const selectQuestionsEntities = createSelector(selectQuestionsState, fromQuestions.selectEntities);
export const selectAllQuestions = createSelector(selectQuestionsState, fromQuestions.selectAll);
export const selectQuestionsTotal = createSelector(selectQuestionsState, fromQuestions.selectTotal);
export const questionsEmptyMoment = createSelector(selectQuestionsState, fromQuestions.selectEmptyMoment);
export const questionsAreLoading = createSelector(selectQuestionsState, fromQuestions.selectLoading);
export const selectCountQuestions = createSelector(selectQuestionsState, fromQuestions.selectCount);
export const selectPageSizeQuestion = createSelector(selectQuestionsState, fromQuestions.selectPageSize);
export const selectPageIndexQuestion = createSelector(selectQuestionsState, fromQuestions.selectPageIndex);
export const selectSearchBy = createSelector(selectQuestionsState, fromQuestions.selectSearchBy);
export const selectLoaded = createSelector(selectQuestionsState, fromQuestions.selectLoaded);
export const selectQuestionNotification = createSelector(selectQuestionsState, fromQuestions.selectNewNofitication);
export const selectQuestionSelected = createSelector(
  fromQuestions.selectEntities, fromQuestions.selectPkSelected, (entities, questionPk) => entities[questionPk]);
export const selectSortBy = createSelector(selectQuestionsState, fromQuestions.selectSortBy);

// Public selectors for answers
const selectAnswersState = createFeatureSelector<fromAnswers.AnswersState>('answers');
export const selectAnswersIds = createSelector(selectAnswersState, fromAnswers.selectIds);
export const selectAnswersEntities = createSelector(selectAnswersState, fromAnswers.selectEntities);
export const selectAllAnswers = createSelector(selectAnswersState, fromAnswers.selectAll);
export const selectAnswersTotal = createSelector(selectAnswersState, fromAnswers.selectTotal);
export const answersEmptyMoment = createSelector(selectAnswersState, fromAnswers.selectEmptyMoment);
export const answersAreLoading = createSelector(selectAnswersState, fromAnswers.selectLoading);
export const selectCountAnswers = createSelector(selectAnswersState, fromAnswers.selectCount);
export const selectPageSizeAnswers = createSelector(selectAnswersState, fromAnswers.selectPageSize);
export const selectPageIndexAnswers = createSelector(selectAnswersState, fromAnswers.selectPageIndex);
export const selectAnswerNotification = createSelector(selectAnswersState, fromAnswers.selectNewNofitication);

// Public selectors for sessions
const selectSessionsState = createFeatureSelector<fromSessions.SessionsState>('sessions');
export const selectSessions = createSelector(selectSessionsState, fromSessions.selectAll);
export const selectPkSessionSelected = createSelector(selectSessionsState, fromSessions.selectPkSelected);
export const selectSessionSelected = createSelector(
  fromSessions.selectEntities, fromSessions.selectPkSelected, (entities, sessionPk) => entities[sessionPk]);
export const selectConnectedUsers  = createSelector(selectSessionsState, fromSessions.selectConnectedUsers);
