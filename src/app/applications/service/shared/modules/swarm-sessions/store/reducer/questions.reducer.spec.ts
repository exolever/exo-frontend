import * as fromQuestions from './questions.reducer';
import * as actionsQuestions from '../action/questions.action';
import { Post } from '@forum/interfaces/post.interface';
import { FakePostFactory } from '@forum/interfaces/postFake.model';
import { QuestionsState } from './questions.reducer';
import { QuestionSortEnum } from '@applications/swarm-sessions/services/swarm-sessions.service';

describe('AnswerReducer', () => {
  const questions: Post[] = [new FakePostFactory().modelPropertiesCustom()];
  const initialState: QuestionsState = {
    ids: [],
    entities: {},
    loading: false,
    loaded: false,
    count: undefined,
    pkQuestionSelected: undefined,
    pageSize: undefined,
    pageIndex: undefined,
    searchBy: '',
    newNotification: false,
    sortBy: QuestionSortEnum.NUM_COMMENTS_ASC,
    session: undefined
  };

  it('Should return the default state', () => {
    const action = { } as any;
    const state = fromQuestions.reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('Should set the load config', () => {
    const action = new actionsQuestions.LoadQuestions({
      pageIndex: 1,
      pageSize: 15,
      pkProject: 1,
      pkTeam: 2,
      pkSession: 1
     });
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      pageIndex: 1,
      pageSize: 15
    });
  });

  it('Should populate the questions array', () => {
    const action = new actionsQuestions.LoadQuestionsSuccess({
      previous: undefined,
      next: undefined,
      count: '1',
      results: questions
     });
    const state = fromQuestions.reducer(initialState, action);
    expect(Object.values(state.entities)).toEqual(questions);
  });

  it('Should set loading a true with CREATE_QUESTION', () => {
    const action = new actionsQuestions.CreateQuestion({
      pkProject: 2,
      pkTeam: 3,
      pkSession: 1,
      data: {}
    });
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with EDIT_QUESTION', () => {
    const action = new actionsQuestions.EditQuestion({
      pkProject: 2,
      pkTeam: 3,
      pkQuestion: 1,
      pkSession: 1,
      data: {}
    });
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with DELETE_QUESTION', () => {
    const action = new actionsQuestions.DeleteQuestion({
      pkProject: 2,
      pkTeam: 3,
      pkQuestion: 1,
      pkSession: 1
    });
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with SELECT_QUESTION', () => {
    const action = new actionsQuestions.SelectQuestion({
      pkQuestion: 1,
      pkProject: 2,
      pkTeam: 3,
      pkSession: 1
    });
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, pkQuestionSelected: 1});
  });

  it('Should set loading a false with LOAD_QUESTIONS_FAIL', () => {
    const action = new actionsQuestions.LoadQuestionsFail({});
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_QUESTION_FAIL', () => {
    const action = new actionsQuestions.CreateQuestionFail({});
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with EDIT_QUESTION_FAIL', () => {
    const action = new actionsQuestions.EditQuestionFail({});
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with DELETE_QUESTION_FAIL', () => {
    const action = new actionsQuestions.DeleteQuestionFail({});
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_QUESTION_SUCCESS', () => {
    const question = <Post>new FakePostFactory().modelPropertiesCustom();
    const action = new actionsQuestions.CreateQuestionSuccess(question);
    const state = fromQuestions.reducer(initialState, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).toContain(question.pk);
  });

  it('Should set loading a false with DELETE_QUESTION_SUCCESS', () => {
    const question = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const action = new actionsQuestions.DeleteQuestionSuccess(question.pk);
    const state = fromQuestions.reducer({
      ...initialState, ids: [question.pk], entities: { 1: question }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).not.toContain(question.pk);
    expect(Object.values(state.entities)).not.toContain(question);
  });

  it('Should update a question after EDIT_QUESTION_SUCCESS', () => {
    const originalQuestion = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const modifiedQuestion = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const action = new actionsQuestions.EditQuestionSuccess(modifiedQuestion);
    const state = fromQuestions.reducer({
      ...initialState, ids: [originalQuestion.pk], entities: { 1: originalQuestion }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).toContain(originalQuestion.pk);
    expect(<Post>state.entities[1]).not.toEqual(<Post>originalQuestion);
  });

  it('Should update a question after RATE_ANSWER_SUCCESS', () => {
    const originalQuestion = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const answerModified = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const action = new actionsQuestions.EditQuestionSuccess(answerModified);
    const state = fromQuestions.reducer({
      ...initialState, ids: [originalQuestion.pk], entities: { 1: originalQuestion }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).toContain(originalQuestion.pk);
    expect(<Post>state.entities[1]).not.toEqual(<Post>originalQuestion);
  });
});
