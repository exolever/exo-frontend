import { Action } from '@ngrx/store';
import { Answer } from '@forum/interfaces/answer.interface';
import { Pagination } from '@core/interfaces/pagination.interface';

export enum TypeActionEnum {
  LOAD_ANSWERS =            '[Jobs - Swarm] Load answers',
  LOAD_ANSWERS_SUCCESS =    '[Jobs - Swarm] Load answers success',
  LOAD_ANSWERS_FAIL =       '[Jobs - Swarm] Load answers fail',
  CREATE_ANSWER =           '[Jobs - Swarm] Create answer',
  CREATE_ANSWER_SUCCESS =   '[Jobs - Swarm] Create answer success',
  CREATE_ANSWER_FAIL =      '[Jobs - Swarm] Create answer fail',
  DELETE_ANSWER =           '[Jobs - Swarm] Delete answer',
  DELETE_ANSWER_SUCCESS =   '[Jobs - Swarm] Delete answer success',
  DELETE_ANSWER_FAIL =      '[Jobs - Swarm] Delete answer fail',
  UPDATE_ANSWER =           '[Jobs - Swarm] Update answer',
  UPDATE_ANSWER_SUCCESS =   '[Jobs - Swarm] Update answer success',
  UPDATE_ANSWER_FAIL =      '[Jobs - Swarm] Update answer fail',
  SET_SESSION =             '[Jobs - Swarm] Load Session answers',
  ENABLE_NOTIFICATON =      '[Jobs - Swarm] Enable answers notification',
  RESTORE =                 '[Jobs - Swarm] Restore answers state',
  SET_FAVORITE =            '[Jobs - Swarm] Anser Set as favorite',
  SET_FAVORITE_SUCCESS =    '[Jobs - Swarm] Anser Set as favorite success',
  SET_FAVORITE_FAIL =       '[Jobs - Swarm] Anser Set as favorite fail',
  UNSET_FAVORITE =          '[Jobs - Swarm] Anser Unset as favorite',
  UNSET_FAVORITE_SUCCESS =  '[Jobs - Swarm] Anser Unset as favorite success',
  UNSET_FAVORITE_FAIL =     '[Jobs - Swarm] Anser Unset as favorite fail'
}

export class LoadAnswers implements Action {
  readonly type = TypeActionEnum.LOAD_ANSWERS;
  constructor(public payload: { pkSession: number, pkQuestion: number, pageIndex: number, pageSize: number}) {}
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
  constructor(public payload: { pkSession: number, pkQuestion: number, data: any}) {}
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
  constructor(public payload: { pkSession: number, pkQuestion: number, pkAnswer: number}) {}
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
  constructor(public payload: { pkSession: number, pkQuestion: number, data: Answer}) {}
}

export class UpdateAnswerSuccess implements Action {
  readonly type = TypeActionEnum.UPDATE_ANSWER_SUCCESS;
  constructor(public payload: Answer) { }
}

export class UpdateAnswerFail implements Action {
  readonly type = TypeActionEnum.UPDATE_ANSWER_FAIL;
  constructor(public payload: any) { }
}

export class SetSession implements Action {
  readonly type = TypeActionEnum.SET_SESSION;
  constructor(public payload: number) {}
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
  | EnableNotification
  | RestoreState
  | SetAsFavorite
  | SetAsFavoriteSuccess
  | SetAsFavoriteFail
  | UnsetAsFavorite
  | UnsetAsFavoriteFail
  | UnsetAsFavoriteSuccess
  | SetSession;
