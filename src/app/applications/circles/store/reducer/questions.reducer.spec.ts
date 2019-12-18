import * as fromQuestions from './questions.reducer';
import * as actionsQuestions from '../action/questions.action';
import { Post } from '@forum/interfaces/post.interface';
import { FakePostFactory } from '@forum/interfaces/postFake.model';
import { QuestionsState } from './questions.reducer';

describe('QuestionReducer', () => {
  const questions: Post[] = [new FakePostFactory().modelPropertiesCustom()];
  const initialState: QuestionsState = {
    ids: [],
    entities: {},
    loading: false,
    loaded: false,
    count: undefined,
    slugQuestionSelected: undefined,
    pageSize: 15,
    pageIndex: 1,
    searchBy: ''
  };

  it('Should return the default state', () => {
    const action = { } as any;
    const state = fromQuestions.reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('Should set the load config', () => {
    const action = new actionsQuestions.LoadQuestions({
      circleSlug: 'my-slug'
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
      circleSlug: 'my-slug',
      data: {}
    });
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with EDIT_QUESTION', () => {
    const action = new actionsQuestions.EditQuestion({
      postPk: 1,
      data: {}
    });
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with DELETE_QUESTION', () => {
    const action = new actionsQuestions.DeleteQuestion(1);
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with SELECT_QUESTION', () => {
    const action = new actionsQuestions.SelectQuestion({
      circleSlug: 'my-slug',
      questionSlug: 'question-slug'
    });
    const state = fromQuestions.reducer(initialState, action);
    expect(state).toEqual({...state, slugQuestionSelected: 'question-slug'});
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
    expect(state.ids).toContain(question.slug);
  });

  it('Should set loading a false with DELETE_QUESTION_SUCCESS', () => {
    const question = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'slug', data: 'my-slug'}]);
    const action = new actionsQuestions.DeleteQuestionSuccess('my-slug');
    const state = fromQuestions.reducer({
      ...initialState, ids: [question.slug], entities: { 'my-slug': question }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).not.toContain(question.slug);
    expect(Object.values(state.entities)).not.toContain(question);
  });

  it('Should update a question after EDIT_QUESTION_SUCCESS', () => {
    const originalQuestion = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'slug', data: 'my-slug'}]);
    const modifiedQuestion = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'slug', data: 'my-slug'}]);
    const action = new actionsQuestions.EditQuestionSuccess(modifiedQuestion);
    const state = fromQuestions.reducer({
      ...initialState, ids: [originalQuestion.slug], entities: { 'my-slug': originalQuestion }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).toContain(originalQuestion.slug);
    expect(<Post>state.entities[1]).not.toEqual(<Post>originalQuestion);
  });

  it('Should update a question after RATE_ANSWER_SUCCESS', () => {
    const originalQuestion = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'slug', data: 'my-slug'}]);
    const answerModified = <Post>new FakePostFactory().modelPropertiesCustom([{name: 'slug', data: 'my-slug'}]);
    const action = new actionsQuestions.EditQuestionSuccess(answerModified);
    const state = fromQuestions.reducer({
      ...initialState, ids: [originalQuestion.slug], entities: { 'my-slug': originalQuestion }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).toContain(originalQuestion.slug);
    expect(<Post>state.entities[1]).not.toEqual(<Post>originalQuestion);
  });
});
