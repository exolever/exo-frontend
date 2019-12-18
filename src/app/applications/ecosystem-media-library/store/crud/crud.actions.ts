import { Action } from '@ngrx/store';
import { Resource } from '../resource.model';
import { PaginationModel } from '@applications/shared/models/pagination.model';

export const UPLOAD = '[MediaLibrary] Upload';
export const UPLOAD_SUCCESS = '[MediaLibrary] Upload Success';
export const UPLOAD_ERROR = '[MediaLibrary] Upload ERROR';
export const UPDATE = '[MediaLibrary] Update';
export const UPDATE_SUCCESS = '[MediaLibrary] Update Success';
export const UPLOAD_SUCCESS_NOTIFICATION = '[MediaLibrary] Update Success Notification';
export const UPDATE_ERROR = '[MediaLibrary] Update ERROR';
export const DELETE = '[MediaLibrary] Delete';
export const DELETE_SUCCESS = '[MediaLibrary] Delete Success';
export const DELETE_ERROR = '[MediaLibrary] Delete ERROR';
export const LOAD_RESOURCES = '[MediaLibrary] Load Resources';

export class Upload implements Action {
  readonly type = UPLOAD;
  constructor(public payload) { }
}

export class UploadSuccess implements Action {
  readonly type = UPLOAD_SUCCESS;
  constructor(public payload: Resource) { }
}

export class UploadSuccessNotification implements Action {
  readonly type = UPLOAD_SUCCESS_NOTIFICATION;
  constructor(public payload: Resource) { }
}

export class UploadError implements Action {
  readonly type = UPLOAD_ERROR;
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload) { }
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload: Resource) { }
}

export class UpdateError implements Action {
  readonly type = UPDATE_ERROR;
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: Resource) { }
}

export class DeleteSuccess implements Action {
  readonly type = DELETE_SUCCESS;
  constructor(public payload: Resource) { }
}

export class DeleteError implements Action {
  readonly type = DELETE_ERROR;
}


export class LoadResources implements Action {
  readonly type = LOAD_RESOURCES;
  constructor(public payload: PaginationModel<Resource>) { }
}


export type All
  = Upload
  | UploadSuccess
  | UploadSuccessNotification
  | UploadError
  | Update
  | UpdateSuccess
  | UpdateError
  | Delete
  | DeleteSuccess
  | DeleteError
  | LoadResources;
