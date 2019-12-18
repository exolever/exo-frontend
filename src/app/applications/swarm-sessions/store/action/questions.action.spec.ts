import { FakePostFactory } from '@forum/interfaces/postFake.model';
import * as questionsActions from './questions.action';


describe('Questions Actions', () => {
  it('Should create a LoadQuestions action', () => {
    const payload = { pkTeam: 1, pkProject: 2, pkSession: 1, pageIndex: 1, pageSize: 5 };
    const action = new questionsActions.LoadQuestions(payload);

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.LOAD_QUESTIONS,
      payload: payload
    });
  });

  it('Should create a LoadQuestionsSuccess action', () => {
    const payload = {
      results: [new FakePostFactory().modelPropertiesCustom()],
      count: '1',
      next: undefined,
      previous: undefined
    };

    const action = new questionsActions.LoadQuestionsSuccess(payload);

    expect( { ...action }).toEqual({
      type: questionsActions.TypeActionEnum.LOAD_QUESTIONS_SUCCESS,
      payload: payload
    });
  });

  it('Should create a LoadQuestionsFail action', () => {
    const action = new questionsActions.LoadQuestionsFail({});

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.LOAD_QUESTIONS_FAIL,
      payload: {}
    });
  });

  it('Should create a SelectQuestion action', () => {
    const payload = {pkProject: 1, pkTeam: 2, pkQuestion: 3, pkSession: 1};
    const action = new questionsActions.SelectQuestion(payload);

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.SELECT_QUESTION,
      payload: payload
    });
  });
});
