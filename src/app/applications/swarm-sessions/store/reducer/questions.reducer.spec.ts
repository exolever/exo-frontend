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
    connectedUsers: [],
    session: undefined,
    sortBy: QuestionSortEnum.NUM_COMMENTS_ASC
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

  it('Should set loading a true with SELECT_QUESTION', () => {
    const action = new actionsQuestions.SelectQuestion({
      pkQuestion: 1,
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
});
