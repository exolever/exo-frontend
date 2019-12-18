import { Action } from '@ngrx/store';
import { UserModel } from '@core/models/user/user.model';
import { UserPictureModel } from '@app/core';

export const INIT_USER = '[User] Init User';
export const GET_USER = '[User] Get User';
export const GET_USER_SUCCESS = '[User] Get User Success';
export const GET_USER_FAIL = '[User] Get User Fail';
export const UPDATE_USER = '[User] Update User';
export const UPDATE_DATA_USER = '[User] Update Data User';
export const LOGGED_INTERCOM = '[User] Update logged intercom';
export const UPDATE_USER_PICTURE = '[User] Update Picture User';
export const LOGOUT_USER = '[User] Logout User';
export const LOGOUT_USER_SUCCESS = '[User] Logout User success';

export class GetUser implements Action {
  readonly type = GET_USER;
}

export class InitUser implements Action {
  readonly type = INIT_USER;
  constructor(public payload: UserModel) {}
}

export class GetUserSuccess implements Action {
  readonly type = GET_USER_SUCCESS;
  constructor(public payload: UserModel) {}
}

export class GetUserFail implements Action {
  readonly type = GET_USER_FAIL;
  constructor(public payload: any) {}
}

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;
  constructor(public payload: UserModel) {}
}

export class UpdateDataUser implements Action {
  readonly type = UPDATE_DATA_USER;
  constructor(public payload: any) {}
}

export class UpdateLoggedIntercom implements Action {
  readonly type = LOGGED_INTERCOM;
  constructor(public payload: boolean) {}
}

export class LogoutUserSuccess implements Action {
  readonly type = LOGOUT_USER_SUCCESS;
}

export class LogoutUser implements Action {
  readonly type = LOGOUT_USER;
}

export class UpdatePictureUser implements Action {
  readonly type = UPDATE_USER_PICTURE;
  constructor(public payload: { profilePictures: UserPictureModel[] }) { }
}

export type UserActions
  = GetUser
  | InitUser
  | GetUserSuccess
  | GetUserFail
  | UpdateUser
  | UpdateLoggedIntercom
  | UpdatePictureUser
  | UpdateDataUser
  | LogoutUser
  | LogoutUserSuccess
;
