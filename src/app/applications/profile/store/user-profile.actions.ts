import { Action } from '@ngrx/store';
import { ConsultantModel, UserApplicationModel } from '@applications/shared/models';

export enum ProfileActionEnum {
  LOAD_USER = '[Profile] Load user',
  LOAD_USER_SUCCESS = '[Profile] Load user success',
  LOAD_USER_FAIL = '[PROFILE] Load user fail',
  SET_CURRENT_SLUG = '[PROFILE] Set current slug',
  UPDATE_USER = '[Profile] Update user'
}

export class LoadUser implements Action {
  readonly type = ProfileActionEnum.LOAD_USER;
  constructor(public payload: string) {}
}

export class LoadUserSuccess implements Action {
  readonly type = ProfileActionEnum.LOAD_USER_SUCCESS;
  constructor(public payload: UserApplicationModel | ConsultantModel) {}
}

export class LoadUserFail implements Action {
  readonly type = ProfileActionEnum.LOAD_USER_FAIL;
  constructor(public payload: any) {}
}

export class SetCurrentSlug implements Action {
  readonly type = ProfileActionEnum.SET_CURRENT_SLUG;
  constructor(public payload: string) {}
}

export class UpdateUser implements Action {
  readonly type = ProfileActionEnum.UPDATE_USER;
  constructor(public payload: {user: UserApplicationModel | ConsultantModel, data: any}) {}
}

export type All = LoadUser | LoadUserSuccess | LoadUserFail | SetCurrentSlug | UpdateUser;
