import { Action } from '@ngrx/store';
import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';

export enum TypeActionEnum {
  LOAD_QUESTIONS =               '[Ask To Ecosystem] Load questions',
  LOAD_QUESTIONS_SUCCESS =       '[Ask To Ecosystem] Load questions success',
  LOAD_QUESTIONS_FAIL =          '[Ask To Ecosystem] Load questions fail',
  LOAD_QUESTION_DETAIL =         '[Ask To Ecosystem] Load question details',
  LOAD_QUESTION_DETAIL_SUCCESS = '[Ask To Ecosystem] Load question details success',
  LOAD_QUESTION_DETAIL_FAIL =    '[Ask To Ecosystem] Load question details fail',
  SELECT_QUESTION =              '[Ask To Ecosystem] Select question',
  CREATE_QUESTION =              '[Ask To Ecosystem] Create question',
  CREATE_QUESTION_SUCCESS =      '[Ask To Ecosystem] Create question success',
  CREATE_QUESTION_FAIL =         '[Ask To Ecosystem] Create question fail',
  EDIT_QUESTION =                '[Ask To Ecosystem] Edit question',
  EDIT_QUESTION_SUCCESS =        '[Ask To Ecosystem] Edit question success',
  EDIT_QUESTION_FAIL =           '[Ask To Ecosystem] Edit question fail',
  DELETE_QUESTION =              '[Ask To Ecosystem] Delete question',
  DELETE_QUESTION_SUCCESS =      '[Ask To Ecosystem] Delete question success',
  DELETE_QUESTION_FAIL =         '[Ask To Ecosystem] Delete question fail',
  SEARCH =                       '[Ask To Ecosystem] Set Search questions',
  RESTORE =                      '[Ask To Ecosystem] Restore questions state',
  SET_PAGINATION =               '[Ask to Ecosystem] Question Set pagination params',
  SET_FAVORITE =                 '[Ask to Ecosystem] Question Set as favorite',
  SET_FAVORITE_SUCCESS =         '[Ask to Ecosystem] Question Set as favorite success',
  SET_FAVORITE_FAIL =            '[Ask to Ecosystem] Question Set as favorite fail',
  UNSET_FAVORITE =               '[Ask to Ecosystem] Question Unset as favorite',
  UNSET_FAVORITE_SUCCESS =       '[Ask to Ecosystem] Question Unset as favorite success',
  UNSET_FAVORITE_FAIL =          '[Ask to Ecosystem] Question Unset as favorite fail'
}

export class LoadQuestions implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTIONS;
  constructor(
    public payload: {pkTeam: number, pkProject: number, pageIndex: number, pageSize: number}) {}
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
  constructor(public payload: {pkTeam: number, pkProject: number, pkQuestion: number}) {}
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
  constructor(public payload: {pkTeam: number, pkProject: number, pkQuestion: number}) {}
}

export class CreateQuestion implements Action {
  readonly type = TypeActionEnum.CREATE_QUESTION;
  constructor(public payload: {pkTeam: number, pkProject: number, data: any}) {}
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
  constructor(public payload: {pkTeam: number, pkProject: number, pkQuestion: number, data: any}) {}
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
  constructor(public payload: {pkTeam: number, pkProject: number, pkQuestion: number}) {}
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
  constructor(public payload: {pkTeam: number, pkProject: number, searchBy: string}) {}
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

export type All
  = LoadQuestions
  | LoadQuestionsSuccess
  | LoadQuestionsFail
  | LoadQuestionDetails
  | LoadQuestionDetailsSuccess
  | LoadQuestionDetailsFail
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
  | SetAsFavorite
  | SetAsFavoriteSuccess
  | SetAsFavoriteFail
  | UnsetAsFavorite
  | UnsetAsFavoriteFail
  | UnsetAsFavoriteSuccess
  | RestoreState;

