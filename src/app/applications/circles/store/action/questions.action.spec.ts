import { FakePostFactory } from '@forum/interfaces/postFake.model';
import * as questionsActions from './questions.action';


describe('Questions Actions', () => {
  it('Should create a LoadQuestions action', () => {
    const payload = { circleSlug: 'my-slug' };
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

  it('Should create a CreateQuestion action', () => {
    const payload = { circleSlug: 'my-slug', data: {} };
    const action = new questionsActions.CreateQuestion(payload);

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.CREATE_QUESTION,
      payload: payload
    });
  });

  it('Should create a CreateQuestionSuccess action', () => {
    const payload = new FakePostFactory().modelPropertiesCustom();
    const action = new questionsActions.CreateQuestionSuccess(payload);

    expect( { ...action }).toEqual({
      type: questionsActions.TypeActionEnum.CREATE_QUESTION_SUCCESS,
      payload: payload
    });
  });

  it('Should create a CreateQuestionFail action', () => {
    const action = new questionsActions.CreateQuestionFail({});

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.CREATE_QUESTION_FAIL,
      payload: {}
    });
  });

  it('Should create a DeleteQuestion action', () => {
    const payload = 1;
    const action = new questionsActions.DeleteQuestion(payload);

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.DELETE_QUESTION,
      payload: payload
    });
  });

  it('Should create a DeleteQuestionSuccess action', () => {
    const payload = new FakePostFactory().modelPropertiesCustom();
    const action = new questionsActions.DeleteQuestionSuccess(payload);

    expect( { ...action }).toEqual({
      type: questionsActions.TypeActionEnum.DELETE_QUESTION_SUCCESS,
      payload: payload
    });
  });

  it('Should create a DeleteQuestionFail action', () => {
    const action = new questionsActions.DeleteQuestionFail({});

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.DELETE_QUESTION_FAIL,
      payload: {}
    });
  });

  it('Should create a EditQuestion action', () => {
    const payload = { postPk: 1, data: {} };
    const action = new questionsActions.EditQuestion(payload);

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.EDIT_QUESTION,
      payload: payload
    });
  });

  it('Should create a EditQuestionSuccess action', () => {
    const payload = new FakePostFactory().modelPropertiesCustom();
    const action = new questionsActions.EditQuestionSuccess(payload);

    expect( { ...action }).toEqual({
      type: questionsActions.TypeActionEnum.EDIT_QUESTION_SUCCESS,
      payload: payload
    });
  });

  it('Should create a EditQuestionFail action', () => {
    const action = new questionsActions.EditQuestionFail({});

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.EDIT_QUESTION_FAIL,
      payload: {}
    });
  });

  it('Should create a SelectQuestion action', () => {
    const payload = {circleSlug: 'my-slug', questionSlug: 'question-slug'};
    const action = new questionsActions.SelectQuestion(payload);

    expect({ ...action }).toEqual({
      type: questionsActions.TypeActionEnum.SELECT_QUESTION,
      payload: payload
    });
  });
});
