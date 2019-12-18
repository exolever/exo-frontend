import * as fromAnswers from './answers.reducer';
import * as actionsAnswers from '../action/answers.action';
import { Answer } from '@forum/interfaces/answer.interface';
import { FakeAnswerFactory } from '@forum/interfaces/answerFake.model';
import { AnswersState } from './answers.reducer';

describe('AnswerReducer', () => {
  const answers: Answer[] = [new FakeAnswerFactory().modelPropertiesCustom()];
  const initialState: AnswersState = {
    ids: [],
    entities: {},
    loading: false,
    count: undefined,
    pkAnswerSelected: undefined,
    pageSize: undefined,
    pageIndex: undefined
  };

  it('Should return the default state', () => {
    const action = { } as any;
    const state = fromAnswers.reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('Should set the load config', () => {
    const action = new actionsAnswers.LoadAnswers({
      pkQuestion: 1,
      pageSize: 15,
      pageIndex: 1
     });
    const state = fromAnswers.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      pageIndex: 1,
      pageSize: 15
    });
  });

  it('Should populate the answers array', () => {
    const action = new actionsAnswers.LoadAnswersSuccess({
      previous: undefined,
      next: undefined,
      count: '1',
      results: answers
     });
    const state = fromAnswers.reducer(initialState, action);
    expect(Object.values(state.entities)).toEqual(answers);
  });


  it('Should set loading a true with CREATE_ANSWER', () => {
    const action = new actionsAnswers.CreateAnswer({
      questionSlug: 'my-slug',
      data: {}
    });
    const state = fromAnswers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a true with DELETE_ANSWER', () => {
    const action = new actionsAnswers.DeleteAnswer('1');
    const state = fromAnswers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: true});
  });

  it('Should set loading a false with LOAD_ANSWERS_FAIL', () => {
    const action = new actionsAnswers.LoadAnswersFail({});
    const state = fromAnswers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_ANSWER_FAIL', () => {
    const action = new actionsAnswers.CreateAnswerFail({});
    const state = fromAnswers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with DELETE_ANSWER_FAIL', () => {
    const action = new actionsAnswers.DeleteAnswerFail({});
    const state = fromAnswers.reducer(initialState, action);
    expect(state).toEqual({...state, loading: false});
  });

  it('Should set loading a false with CREATE_ANSWER_SUCCESS', () => {
    const answer = <Answer>new FakeAnswerFactory().modelPropertiesCustom();
    const action = new actionsAnswers.CreateAnswerSuccess(answer);
    const state = fromAnswers.reducer(initialState, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).toContain(answer.pk);
    expect(Object.values(state.entities)).toContain(answer);
  });

  it('Should set loading a false with DELETE_ANSWER_SUCCESS', () => {
    const answer = <Answer>new FakeAnswerFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const action = new actionsAnswers.DeleteAnswerSuccess(answer.pk.toString());
    const state = fromAnswers.reducer({
      ...initialState, ids: [answer.pk], entities: { 1: answer }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).not.toContain(answer.pk);
    expect(Object.values(state.entities)).not.toContain(answer);
  });

  it('Should update a question after UPDATE_ANSWER_SUCCESS', () => {
    const answerOriginal = <Answer>new FakeAnswerFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const answerModified = <Answer>new FakeAnswerFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const action = new actionsAnswers.UpdateAnswerSuccess(answerModified);
    const state = fromAnswers.reducer({
      ...initialState, ids: [answerOriginal.pk], entities: { '1': answerOriginal }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).toContain(answerOriginal.pk);
    expect(<Answer>state.entities[1]).not.toEqual(<Answer>answerOriginal);
  });

  it('Should update a question after RATE_ANSWER_SUCCESS', () => {
    const answerOriginal = <Answer>new FakeAnswerFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const answerModified = <Answer>new FakeAnswerFactory().modelPropertiesCustom([{name: 'pk', data: 1}]);
    const action = new actionsAnswers.UpdateAnswerSuccess(answerModified);
    const state = fromAnswers.reducer({
      ...initialState, ids: [answerOriginal.pk], entities: { 1: answerOriginal }
    }, action);
    expect(state.loading).toEqual(false);
    expect(state.ids).toContain(answerOriginal.pk);
    expect(<Answer>state.entities[1]).not.toEqual(<Answer>answerOriginal);
  });
});
