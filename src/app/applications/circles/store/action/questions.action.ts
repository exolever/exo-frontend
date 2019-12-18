import { Action } from '@ngrx/store';
import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';

export enum TypeActionEnum {
  LOAD_QUESTIONS =               '[Circles - Posts] Load questions',
  LOAD_QUESTIONS_SUCCESS =       '[Circles - Posts] Load questions success',
  LOAD_QUESTIONS_FAIL =          '[Circles - Posts] Load questions fail',
  LOAD_QUESTION_DETAIL =         '[Circles - Posts] Load question details',
  LOAD_QUESTION_DETAIL_SUCCESS = '[Circles - Posts] Load question details success',
  LOAD_QUESTION_DETAIL_FAIL =    '[Circles - Posts] Load question details fail',
  SELECT_QUESTION =              '[Circles - Posts] Select question',
  CREATE_QUESTION =              '[Circles - Posts] Create question',
  CREATE_QUESTION_SUCCESS =      '[Circles - Posts] Create question success',
  CREATE_QUESTION_FAIL =         '[Circles - Posts] Create question fail',
  EDIT_QUESTION =                '[Circles - Posts] Edit question',
  EDIT_QUESTION_SUCCESS =        '[Circles - Posts] Edit question success',
  EDIT_QUESTION_FAIL =           '[Circles - Posts] Edit question fail',
  DELETE_QUESTION =              '[Circles - Posts] Delete question',
  DELETE_QUESTION_SUCCESS =      '[Circles - Posts] Delete question success',
  DELETE_QUESTION_FAIL =         '[Circles - Posts] Delete question fail',
  SEARCH =                       '[Circles - Posts] Set Search questions',
  RESTORE =                      '[Circles - Posts] Restore initial state',
  SET_PAGINATION =               '[Circles - Posts] Set pagination params',
  SET_FAVORITE =                 '[Circles - Posts] Set as favorite',
  SET_FAVORITE_SUCCESS =         '[Circles - Posts] Set as favorite success',
  SET_FAVORITE_FAIL =            '[Circles - Posts] Set as favorite fail',
  UNSET_FAVORITE =               '[Circles - Posts] Unset as favorite',
  UNSET_FAVORITE_SUCCESS =       '[Circles - Posts] Unset as favorite success',
  UNSET_FAVORITE_FAIL =          '[Circles - Posts] Unset as favorite fail'
}

export class LoadQuestions implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTIONS;
  constructor(public payload: {circleSlug: string}) {}
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
  constructor(public payload: {circleSlug: string, questionSlug: string}) {}
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
  constructor(public payload: { circleSlug: string, questionSlug: string}) {}
}

export class CreateQuestion implements Action {
  readonly type = TypeActionEnum.CREATE_QUESTION;
  constructor(public payload: {circleSlug: string, data: any}) {}
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
  constructor(public payload: {postPk: number, data: any}) {}
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
  constructor(public payload: number) {}
}

export class DeleteQuestionSuccess implements Action {
  readonly type = TypeActionEnum.DELETE_QUESTION_SUCCESS;
  constructor(public payload: string) { }
}

export class DeleteQuestionFail implements Action {
  readonly type = TypeActionEnum.DELETE_QUESTION_FAIL;
  constructor(public payload: any) { }
}

export class SetSearch implements Action {
  readonly type = TypeActionEnum.SEARCH;
  constructor(public payload: {circleSlug: string, searchBy: string}) {}
}

export class SetPagination implements Action {
  readonly type = TypeActionEnum.SET_PAGINATION;
  constructor(public payload: {circleSlug: string, pageIndex: number; pageSize: number}) {}
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

export class RestoreState implements Action {
  readonly type = TypeActionEnum.RESTORE;
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
  | SetPagination
  | LoadQuestionDetails
  | LoadQuestionDetailsSuccess
  | LoadQuestionDetailsFail
  | SetAsFavorite
  | SetAsFavoriteSuccess
  | SetAsFavoriteFail
  | UnsetAsFavorite
  | UnsetAsFavoriteFail
  | UnsetAsFavoriteSuccess
  | RestoreState;
