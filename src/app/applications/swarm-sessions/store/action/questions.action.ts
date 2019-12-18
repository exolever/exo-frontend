import { Action } from '@ngrx/store';
import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';
import { QuestionSortEnum } from '@applications/swarm-sessions/services/swarm-sessions.service';

export enum TypeActionEnum {
  LOAD_QUESTIONS =               '[Jobs - Swarm] Load questions',
  LOAD_QUESTIONS_SUCCESS =       '[Jobs - Swarm] Load questions success',
  LOAD_QUESTIONS_FAIL =          '[Jobs - Swarm] Load questions fail',
  LOAD_SESSION =                 '[Jobs - Swarm] Load session',
  LOAD_SESSION_SUCCESS =         '[Jobs - Swarm] Load session success',
  LOAD_SESSION_FAIL =            '[Jobs - Swarm] Load session fail',
  LOAD_QUESTION_DETAIL =         '[Jobs - Swarm] Load question details',
  LOAD_QUESTION_DETAIL_SUCCESS = '[Jobs - Swarm] Load question details success',
  LOAD_QUESTION_DETAIL_FAIL =    '[Jobs - Swarm] Load question details fail',
  SELECT_QUESTION =              '[Jobs - Swarm] Select question',
  SEARCH =                       '[Jobs - Swarm] Set Search questions',
  RESTORE =                      '[Jobs - Swarm] Restore initial state',
  ENABLE_NOTIFICATON =           '[Jobs - Swarm] Enable questions notification',
  ADD_USERS =                    '[Jobs - Swarm] Initialize connected users',
  ADD_USERS_SUCCESS =            '[Jobs - Swarm] Initialize connected users success',
  ADD_USERS_FAIL =               '[Jobs - Swarm] Initialize connected users fail',
  ADD_USER =                     '[Jobs - Swarm] Add connected user',
  REMOVE_USER =                  '[Jobs - Swarm] Remove connected user',
  SORT =                         '[Jobs - Swarm] Sort list',
  SET_PAGINATION =               '[Jobs - Swarm] Set pagination params',
  SET_FAVORITE =                 '[Jobs - Swarm] Set as favorite',
  SET_FAVORITE_SUCCESS =         '[Jobs - Swarm] Set as favorite success',
  SET_FAVORITE_FAIL =            '[Jobs - Swarm] Set as favorite fail',
  UNSET_FAVORITE =               '[Jobs - Swarm] Unset as favorite',
  UNSET_FAVORITE_SUCCESS =       '[Jobs - Swarm] Unset as favorite success',
  UNSET_FAVORITE_FAIL =          '[Jobs - Swarm] Unset as favorite fail'
}

export class LoadQuestions implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTIONS;
  constructor(
    public payload: {pkSession: number, pageIndex: number, pageSize: number, sort?: QuestionSortEnum}) {}
}

export class LoadQuestionsSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTIONS_SUCCESS;
  constructor(public payload: Pagination<Post>) { }
}

export class LoadQuestionsFail implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTIONS_FAIL;
  constructor(public payload: any) { }
}

export class LoadSession implements Action {
  readonly type = TypeActionEnum.LOAD_SESSION;
  constructor(public payload:  number) {}
}

export class LoadSessionSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_SESSION_SUCCESS;
  constructor(public payload: SwarmSession) { }
}

export class LoadSessionFail implements Action {
  readonly type = TypeActionEnum.LOAD_SESSION_FAIL;
  constructor(public payload: any) { }
}

export class LoadQuestionDetails implements Action {
  readonly type = TypeActionEnum.LOAD_QUESTION_DETAIL;
  constructor(public payload: {pkSession: number, pkQuestion: number}) {}
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
  constructor(public payload: {pkSession: number, pkQuestion: number}) {}
}

export class SetSearch implements Action {
  readonly type = TypeActionEnum.SEARCH;
  constructor(public payload: { pkSession: number, searchBy: string, sort: QuestionSortEnum }) {}
}

export class RestoreState implements Action {
  readonly type = TypeActionEnum.RESTORE;
}

export class EnableNotification implements Action {
  readonly type = TypeActionEnum.ENABLE_NOTIFICATON;
  constructor(public payload?: any) { }
}

export class AddConnectedUser implements Action {
  readonly type = TypeActionEnum.ADD_USER;
  constructor(public payload: string) {}
}

export class RemoveConnectedUser implements Action {
  readonly type = TypeActionEnum.REMOVE_USER;
  constructor(public payload: string) {}
}

export class InitConnectedUsers implements Action {
  readonly type = TypeActionEnum.ADD_USERS;
}

export class InitConnectedUsersSuccess implements Action {
  readonly type = TypeActionEnum.ADD_USERS_SUCCESS;
  constructor(public payload: string[]) {}
}

export class InitConnectedUsersFail implements Action {
  readonly type = TypeActionEnum.ADD_USERS_FAIL;
  constructor(public payload: any) {}
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

export class SortQuestions implements Action {
  readonly type = TypeActionEnum.SORT;
  constructor(public payload: { pkSession: number, sort: QuestionSortEnum, page: { size: number, index: number } }) { }
}

export type All
  = LoadQuestions
  | LoadQuestionsSuccess
  | LoadQuestionsFail
  | LoadSession
  | LoadSessionSuccess
  | LoadSessionFail
  | SelectQuestion
  | SetSearch
  | LoadQuestionDetails
  | LoadQuestionDetailsSuccess
  | LoadQuestionDetailsFail
  | RestoreState
  | EnableNotification
  | AddConnectedUser
  | RemoveConnectedUser
  | InitConnectedUsers
  | InitConnectedUsersSuccess
  | SetAsFavorite
  | SetAsFavoriteSuccess
  | SetAsFavoriteFail
  | UnsetAsFavorite
  | UnsetAsFavoriteFail
  | UnsetAsFavoriteSuccess
  | InitConnectedUsersFail
  | SortQuestions;
