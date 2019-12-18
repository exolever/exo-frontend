import * as fromQuestions from './questions.reducer';
import * as fromAnswers from './answers.reducer';
import * as fromCircles from './circles.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface CirclesState {
  circles: fromCircles.CirclesState;
  questions: fromQuestions.QuestionsState;
  answers: fromAnswers.AnswersState;
}

export const reducers: ActionReducerMap<CirclesState> = {
  circles: fromCircles.reducer,
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
export const selectQuestionSelected = createSelector(
  fromQuestions.selectEntities, fromQuestions.selectSlugSelected, (entities, questionSlug) => entities[questionSlug]);
export const selectPkBySlug = createSelector(fromQuestions.selectEntities, (entities, slug) => entities[slug].pk);
export const selectSlugByPk = createSelector(selectQuestionsState, fromQuestions.selectSlugByPk);

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

// Public selectors for circles
const selectCirclesState = createFeatureSelector<fromCircles.CirclesState>('circles');
export const selectAllCircles = createSelector(selectCirclesState, fromCircles.selectAll);
export const selectPkSessionSelected = createSelector(selectCirclesState, fromCircles.selectSlugSelected);
export const circlesAreLoading = createSelector(selectCirclesState, fromCircles.selectLoading);
export const selectCircleSelected = createSelector(
  fromCircles.selectEntities, fromCircles.selectSlugSelected, (entities, circleSlug) => entities[circleSlug]);
export const selectSuggestedCircles = createSelector(selectCirclesState, fromCircles.selectSuggestedCircles);
