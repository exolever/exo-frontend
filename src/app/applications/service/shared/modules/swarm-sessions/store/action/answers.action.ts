import { Action } from '@ngrx/store';
import { Answer } from '@forum/interfaces/answer.interface';
import { Pagination } from '@core/interfaces/pagination.interface';

export enum TypeActionEnum {
  LOAD_ANSWERS =            '[Service - Swarm session] Load answers',
  LOAD_ANSWERS_SUCCESS =    '[Service - Swarm session] Load answers success',
  LOAD_ANSWERS_FAIL =       '[Service - Swarm session] Load answers fail',
  CREATE_ANSWER =           '[Service - Swarm session] Create answer',
  CREATE_ANSWER_SUCCESS =   '[Service - Swarm session] Create answer success',
  CREATE_ANSWER_FAIL =      '[Service - Swarm session] Create answer fail',
  DELETE_ANSWER =           '[Service - Swarm session] Delete answer',
  DELETE_ANSWER_SUCCESS =   '[Service - Swarm session] Delete answer success',
  DELETE_ANSWER_FAIL =      '[Service - Swarm session] Delete answer fail',
  UPDATE_ANSWER =           '[Service - Swarm session] Update answer',
  UPDATE_ANSWER_SUCCESS =   '[Service - Swarm session] Update answer success',
  UPDATE_ANSWER_FAIL =      '[Service - Swarm session] Update answer fail',
  RATE_ANSWER =             '[Service - Swarm session] Rate answer',
  RATE_ANSWER_SUCCESS =     '[Service - Swarm session] Rate answer success',
  RATE_ANSWER_FAIL =        '[Service - Swarm session] Rate answer fail',
  ENABLE_NOTIFICATON =      '[Service - Swarm session] Enable answers notification',
  RESTORE =                 '[Service - Swarm session] Restore state',
  SET_FAVORITE =            '[Service - Swarm session] Answer Set as favorite',
  SET_FAVORITE_SUCCESS =    '[Service - Swarm session] Answer Set as favorite success',
  SET_FAVORITE_FAIL =       '[Service - Swarm session] Answer Set as favorite fail',
  SET_SESSION =             '[Service - Swarm session] Set session answers',
  UNSET_FAVORITE =          '[Service - Swarm session] Answer Unset as favorite',
  UNSET_FAVORITE_SUCCESS =  '[Service - Swarm session] Answer Unset as favorite success',
  UNSET_FAVORITE_FAIL =     '[Service - Swarm session] Answer Unset as favorite fail'
}

export class LoadAnswers implements Action {
  readonly type = TypeActionEnum.LOAD_ANSWERS;
  constructor(public payload: {
    pkTeam: number, pkProject: number, pkSession: number, pkQuestion: number, pageIndex: number, pageSize: number}) {}
}

export class LoadAnswersSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_ANSWERS_SUCCESS;
  constructor(public payload: Pagination<Answer>) { }
}

export class LoadAnswersFail implements Action {
  readonly type = TypeActionEnum.LOAD_ANSWERS_FAIL;
  constructor(public payload: any) { }
}

export class CreateAnswer implements Action {
  readonly type = TypeActionEnum.CREATE_ANSWER;
  constructor(public payload: {
    pkTeam: number, pkProject: number, pkSession: number, pkQuestion: number, data: any}) {}
}

export class CreateAnswerSuccess implements Action {
  readonly type = TypeActionEnum.CREATE_ANSWER_SUCCESS;
  constructor(public payload: Answer) { }
}

export class CreateAnswerFail implements Action {
  readonly type = TypeActionEnum.CREATE_ANSWER_FAIL;
  constructor(public payload: any) { }
}

export class DeleteAnswer implements Action {
  readonly type = TypeActionEnum.DELETE_ANSWER;
  constructor(public payload: {
    pkTeam: number, pkProject: number, pkSession: number, pkQuestion: number, pkAnswer: number}) {}
}

export class DeleteAnswerSuccess implements Action {
  readonly type = TypeActionEnum.DELETE_ANSWER_SUCCESS;
  constructor(public payload: number) { }
}

export class DeleteAnswerFail implements Action {
  readonly type = TypeActionEnum.DELETE_ANSWER_FAIL;
  constructor(public payload: any) { }
}

export class UpdateAnswer implements Action {
  readonly type = TypeActionEnum.UPDATE_ANSWER;
  constructor(public payload: {
    pkTeam: number, pkProject: number,  pkSession: number, pkQuestion: number, data: Answer}) {}
}

export class UpdateAnswerSuccess implements Action {
  readonly type = TypeActionEnum.UPDATE_ANSWER_SUCCESS;
  constructor(public payload: Answer) { }
}

export class UpdateAnswerFail implements Action {
  readonly type = TypeActionEnum.UPDATE_ANSWER_FAIL;
  constructor(public payload: any) { }
}

export class RateAnswer implements Action {
  readonly type = TypeActionEnum.RATE_ANSWER;
  constructor(public payload: {
    pkTeam: number, pkProject: number, pkQuestion: number,  pkSession: number, pkAnswer: number, rating: number}) {}
}

export class RateAnswerSuccess implements Action {
  readonly type = TypeActionEnum.RATE_ANSWER_SUCCESS;
  constructor(public payload: Answer) { }
}

export class RateAnswerFail implements Action {
  readonly type = TypeActionEnum.RATE_ANSWER_FAIL;
  constructor(public payload: any) { }
}

export class EnableNotification implements Action {
  readonly type = TypeActionEnum.ENABLE_NOTIFICATON;
  constructor(public payload: any) { }
}

export class RestoreState implements Action {
  readonly type = TypeActionEnum.RESTORE;
}

export class SetAsFavorite implements Action {
  readonly type = TypeActionEnum.SET_FAVORITE;
  constructor(public payload: number) {}
}

export class SetAsFavoriteSuccess implements Action {
  readonly type = TypeActionEnum.SET_FAVORITE_SUCCESS;
  constructor(public payload: Answer) { }
}

export class SetAsFavoriteFail implements Action {
  readonly type = TypeActionEnum.SET_FAVORITE_FAIL;
  constructor(public payload: any) { }
}

export class SetSession implements Action {
  readonly type = TypeActionEnum.SET_SESSION;
  constructor(public payload: number) { }
}

export class UnsetAsFavorite implements Action {
  readonly type = TypeActionEnum.UNSET_FAVORITE;
  constructor(public payload: number) {}
}

export class UnsetAsFavoriteSuccess implements Action {
  readonly type = TypeActionEnum.UNSET_FAVORITE_SUCCESS;
  constructor(public payload: Answer) { }
}

export class UnsetAsFavoriteFail implements Action {
  readonly type = TypeActionEnum.UNSET_FAVORITE_FAIL;
  constructor(public payload: any) { }
}

export type All
  = LoadAnswers
  | LoadAnswersSuccess
  | LoadAnswersFail
  | CreateAnswer
  | CreateAnswerSuccess
  | CreateAnswerFail
  | DeleteAnswer
  | DeleteAnswerSuccess
  | DeleteAnswerFail
  | UpdateAnswer
  | UpdateAnswerSuccess
  | UpdateAnswerFail
  | RateAnswer
  | RateAnswerSuccess
  | RateAnswerFail
  | EnableNotification
  | RestoreState
  | SetAsFavorite
  | SetAsFavoriteSuccess
  | SetAsFavoriteFail
  | UnsetAsFavorite
  | UnsetAsFavoriteFail
  | SetSession
  | UnsetAsFavoriteSuccess;
