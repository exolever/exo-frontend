import { Action } from '@ngrx/store';
import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { QuestionSortEnum } from '@applications/swarm-sessions/services/swarm-sessions.service';

export enum TypeActionEnum {
  LOAD_QUESTIONS =               '[Service - swarm session] Load questions',
  LOAD_QUESTIONS_SUCCESS =       '[Service - swarm session] Load questions success',
  LOAD_QUESTIONS_FAIL =          '[Service - swarm session] Load questions fail',
  LOAD_QUESTION_DETAIL =         '[Service - swarm session] Load question details',
  LOAD_QUESTION_DETAIL_SUCCESS = '[Service - swarm session] Load question details success',
  LOAD_QUESTION_DETAIL_FAIL =    '[Service - swarm session] Load question details fail',
  SELECT_QUESTION =              '[Service - swarm session] Select question',
  CREATE_QUESTION =              '[Service - swarm session] Create question',
  CREATE_QUESTION_SUCCESS =      '[Service - swarm session] Create question success',
  CREATE_QUESTION_FAIL =         '[Service - swarm session] Create question fail',
  EDIT_QUESTION =                '[Service - swarm session] Edit question',
  EDIT_QUESTION_SUCCESS =        '[Service - swarm session] Edit question success',
  EDIT_QUESTION_FAIL =           '[Service - swarm session] Edit question fail',
  DELETE_QUESTION =              '[Service - swarm session] Delete question',
  DELETE_QUESTION_SUCCESS =      '[Service - swarm session] Delete question success',
  DELETE_QUESTION_FAIL =         '[Service - swarm session] Delete question fail',
  SEARCH =                       '[Service - swarm session] Set Search questions',
  RESTORE =                      '[Service - swarm session] Restore initial state',
  SET_SESSION =                  '[Service - swarm session] Set session questions',
  ENABLE_NOTIFICATON =           '[Service - Swarm session] Enable questions notification',
  SORT =                         '[Service - Swarm session] Sort list',
  SET_PAGINATION =               '[Service - Swarm session] Set pagination params',
  SET_FAVORITE =                 '[Service - Swarm session] Set as favorite',
  SET_FAVORITE_SUCCESS =         '[Service - Swarm session] Set as favorite success',
  SET_FAVORITE_FAIL =            '[Service - Swarm session] Set as favorite fail',
  UNSET_FAVORITE =               '[Service - Swarm session] Unset as favorite',
  UNSET_FAVORITE_SUCCESS =       '[Service - Swarm session] Unset as favorite success',
  UNSET_FAVORITE_FAIL =          '[Service - Swarm session] Unset as favorite fail'
}

export class LoadQuestions implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTIONS;
  constructor(
    public payload: {
      pkTeam: number, pkProject: number, pkSession: number, pageIndex: number, pageSize: number, sortBy?: string
    }) {}
}

export class LoadQuestionsSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTIONS_SUCCESS;
  constructor(public payload: Pagination<Post>) { }
}

export class LoadQuestionsFail implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTIONS_FAIL;
  constructor(public payload: any) { }
}
export class LoadQuestionDetails implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTION_DETAIL;
  constructor(public payload: {pkTeam: number, pkProject: number, pkSession: number, pkQuestion: number}) {}
}

export class LoadQuestionDetailsSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTION_DETAIL_SUCCESS;
  constructor(public payload: Post) {}
}

export class LoadQuestionDetailsFail implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTION_DETAIL_FAIL;
  constructor(public payload: any) { }
}

export class SelectQuestion implements Action {
  readonly type = TypeActionEnum.SELECT_QUESTION;
  constructor(public payload: {pkTeam: number, pkProject: number, pkSession: number, pkQuestion: number}) {}
}

export class CreateQuestion implements Action {
  readonly type = TypeActionEnum.CREATE_QUESTION;
  constructor(public payload: {pkTeam: number, pkProject: number, pkSession: number, data: any}) {}
}

export class CreateQuestionSuccess implements Action {
  readonly type = TypeActionEnum.CREATE_QUESTION_SUCCESS;
  constructor(public payload: Post) { }
}

export class CreateQuestionFail implements Action {
  readonly type = TypeActionEnum.CREATE_QUESTION_FAIL;
  constructor(public payload: any) { }
}

export class EditQuestion implements Action {
  readonly type = TypeActionEnum.EDIT_QUESTION;
  constructor(public payload: {pkTeam: number, pkProject: number, pkSession: number, pkQuestion: number, data: any}) {}
}

export class EditQuestionSuccess implements Action {
  readonly type = TypeActionEnum.EDIT_QUESTION_SUCCESS;
  constructor(public payload: Post) { }
}

export class EditQuestionFail implements Action {
  readonly type = TypeActionEnum.EDIT_QUESTION_FAIL;
  constructor(public payload: any) { }
}

export class DeleteQuestion implements Action {
  readonly type = TypeActionEnum.DELETE_QUESTION;
  constructor(public payload: {pkTeam: number, pkProject: number, pkSession: number, pkQuestion: number}) {}
}

export class DeleteQuestionSuccess implements Action {
  readonly type = TypeActionEnum.DELETE_QUESTION_SUCCESS;
  constructor(public payload: number) { }
}

export class DeleteQuestionFail implements Action {
  readonly type = TypeActionEnum.DELETE_QUESTION_FAIL;
  constructor(public payload: any) { }
}

export class SetSearch implements Action {
  readonly type = TypeActionEnum.SEARCH;
  constructor(public payload:
                { pkTeam: number, pkProject: number, pkSession: number, searchBy: string, sort: QuestionSortEnum }) {}
}

export class RestoreState implements Action {
  readonly type = TypeActionEnum.RESTORE;
}

export class EnableNotification implements Action {
  readonly type = TypeActionEnum.ENABLE_NOTIFICATON;
  constructor(public payload: any) { }
}

export class SetAsFavorite implements Action {
  readonly type = TypeActionEnum.SET_FAVORITE;
  constructor(public payload: number) {}
}

export class SetAsFavoriteSuccess implements Action {
  readonly type = TypeActionEnum.SET_FAVORITE_SUCCESS;
  constructor(public payload: Post) { }
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
  constructor(public payload: Post) { }
}

export class UnsetAsFavoriteFail implements Action {
  readonly type = TypeActionEnum.UNSET_FAVORITE_FAIL;
  constructor(public payload: any) { }
}

export class SetSession implements Action {
  readonly type = TypeActionEnum.SET_SESSION;
  constructor(public payload: number) { }
}

export class SortQuestions implements Action {
  readonly type = TypeActionEnum.SORT;
  constructor(public payload: {
    pkTeam: number,
    pkProject: number,
    pkSession: number,
    sort: QuestionSortEnum,
    page: { size: number, index: number }
  }) { }
}

export type All
  = LoadQuestions
  | LoadQuestionsSuccess
  | LoadQuestionsFail
  | SelectQuestion
  | CreateQuestion
  | CreateQuestionSuccess
  | CreateQuestionFail
  | EditQuestion
  | EditQuestionSuccess
  | EditQuestionFail
  | DeleteQuestion
  | DeleteQuestionSuccess
  | DeleteQuestionFail
  | SetSearch
  | LoadQuestionDetails
  | LoadQuestionDetailsSuccess
  | LoadQuestionDetailsFail
  | RestoreState
  | EnableNotification
  | SetAsFavorite
  | SetAsFavoriteSuccess
  | SetAsFavoriteFail
  | UnsetAsFavorite
  | UnsetAsFavoriteFail
  | UnsetAsFavoriteSuccess
  | SetSession
  | SortQuestions;
