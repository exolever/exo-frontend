import { FakeAnswerFactory } from '@forum/interfaces/answerFake.model';
import * as answerActions from './answers.action';


describe('Answers Actions', () => {
  it('Should create a LoadAnswers action', () => {
    const payload = { pkTeam: 1, pkProject: 2, pkQuestion: 3, pageIndex: 1, pageSize: 5, pkSession: 1 };
    const action = new answerActions.LoadAnswers(payload);

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.LOAD_ANSWERS,
      payload: payload
    });
  });

  it('Should create a LoadAnswersSuccess action', () => {
    const payload = {
      results: [new FakeAnswerFactory().modelPropertiesCustom()],
      count: '1',
      next: undefined,
      previous: undefined
    };

    const action = new answerActions.LoadAnswersSuccess(payload);

    expect( { ...action }).toEqual({
      type: answerActions.TypeActionEnum.LOAD_ANSWERS_SUCCESS,
      payload: payload
    });
  });

  it('Should create a LoadAnswersFail action', () => {
    const action = new answerActions.LoadAnswersFail({});

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.LOAD_ANSWERS_FAIL,
      payload: {}
    });
  });

  it('Should create a CreateAnswer action', () => {
    const payload = { questionSlug: 'my-slug',  data: {} };
    const action = new answerActions.CreateAnswer(payload);

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.CREATE_ANSWER,
      payload: payload
    });
  });

  it('Should create a CreateAnswersSuccess action', () => {
    const payload = new FakeAnswerFactory().modelPropertiesCustom();

    const action = new answerActions.CreateAnswerSuccess(payload);

    expect( { ...action }).toEqual({
      type: answerActions.TypeActionEnum.CREATE_ANSWER_SUCCESS,
      payload: payload
    });
  });

  it('Should create a CreateAnswerFail action', () => {
    const action = new answerActions.CreateAnswerFail({});

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.CREATE_ANSWER_FAIL,
      payload: {}
    });
  });

  it('Should create a DeleteAnswer action', () => {
    const payload = ' 4';
    const action = new answerActions.DeleteAnswer(payload);

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.DELETE_ANSWER,
      payload: payload
    });
  });

  it('Should create a DeleteAnswerSuccess action', () => {
    const payload = new FakeAnswerFactory().modelPropertiesCustom();

    const action = new answerActions.DeleteAnswerSuccess(payload);

    expect( { ...action }).toEqual({
      type: answerActions.TypeActionEnum.DELETE_ANSWER_SUCCESS,
      payload: payload
    });
  });

  it('Should create a DeleteAnswerFail action', () => {
    const action = new answerActions.DeleteAnswerFail({});

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.DELETE_ANSWER_FAIL,
      payload: {}
    });
  });

  it('Should create a UpdateAnswer action', () => {
    const payload = { pkAnswer: 1, data: new FakeAnswerFactory().modelPropertiesCustom() };
    const action = new answerActions.UpdateAnswer(payload);

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.UPDATE_ANSWER,
      payload: payload
    });
  });

  it('Should create a UpdateAnswerSuccess action', () => {
    const payload = new FakeAnswerFactory().modelPropertiesCustom();

    const action = new answerActions.UpdateAnswerSuccess(payload);

    expect( { ...action }).toEqual({
      type: answerActions.TypeActionEnum.UPDATE_ANSWER_SUCCESS,
      payload: payload
    });
  });

  it('Should create a UpdateAnswerFail action', () => {
    const action = new answerActions.UpdateAnswerFail({});

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.UPDATE_ANSWER_FAIL,
      payload: {}
    });
  });

  it('Should create a RateAnswer action', () => {
    const payload = { pkTeam: 1, pkProject: 2, pkQuestion: 3, pkAnswer: 4, pkSession: 1, rating: 1 };
    const action = new answerActions.RateAnswer(payload);

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.RATE_ANSWER,
      payload: payload
    });
  });

  it('Should create a RateAnswerSuccess action', () => {
    const payload = new FakeAnswerFactory().modelPropertiesCustom();
    const action = new answerActions.RateAnswerSuccess(payload);

    expect( { ...action }).toEqual({
      type: answerActions.TypeActionEnum.RATE_ANSWER_SUCCESS,
      payload: payload
    });
  });

  it('Should create a RateAnswerFail action', () => {
    const action = new answerActions.RateAnswerFail({});

    expect({ ...action }).toEqual({
      type: answerActions.TypeActionEnum.RATE_ANSWER_FAIL,
      payload: {}
    });
  });
});
