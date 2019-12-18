import { Action } from '@ngrx/store';
import { Pagination } from '@core/interfaces/pagination.interface';

import { GenericProject } from '../../models/project.model';

export enum TypeActionEnum {
  LOAD =                '[Workspace - Project] Load',
  LOAD_SUCCESS =        '[Workspace - Project] Load success',
  LOAD_FAIL =           '[Workspace - Project] Load fail',
  LOAD_DETAIL =         '[Workspace - Project] Load details',
  LOAD_DETAIL_SUCCESS = '[Workspace - Project] Load details success',
  LOAD_DETAIL_FAIL =    '[Workspace - Project] Load details fail',
  CREATE =              '[Workspace - Project] Create',
  CREATE_SUCCESS =      '[Workspace - Project] Create success',
  CREATE_FAIL =         '[Workspace - Project] Create fail',
  EDIT =                '[Workspace - Project] Edit',
  EDIT_SUCCESS =        '[Workspace - Project] Edit success',
  EDIT_FAIL =           '[Workspace - Project] Edit fail',
  DELETE =              '[Workspace - Project] Delete',
  DELETE_SUCCESS =      '[Workspace - Project] Delete success',
  DELETE_FAIL =         '[Workspace - Project] Delete fail',
  SEARCH =              '[Workspace - Project] Set Search',
  RESTORE =             '[Workspace - Project] Restore initial state',
  SET_PAGINATION =      '[Workspace - Project] Set pagination params',
  SORTBY =              '[Workspace - Project] Set sort by params',
  PUBLISH =             '[Workspace - Project] Publish',
  PUBLISH_SUCCESS =     '[Workspace - Project] Publish success',
  PUBLISH_FAIL =        '[Workspace - Project] Publish fail',
  SETTINGS =            '[Workspace - Project] Change settings',
  SETTINGS_SUCCESS =    '[Workspace - Project] Change settings success',
  SETTINGS_FAIL =       '[Workspace - Project] Change settings fail',
}

export class Load implements Action {
  readonly type = TypeActionEnum.LOAD;
  constructor() {}
}

export class LoadSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_SUCCESS;
  constructor(public payload: Pagination<GenericProject>) { }
}

export class LoadFail implements Action {
  readonly type = TypeActionEnum.LOAD_FAIL;
  constructor(public payload: any) { }
}
export class LoadDetails implements Action {
  readonly type = TypeActionEnum.LOAD_DETAIL;
  constructor(public payload: number) {}
}

export class LoadDetailsSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_DETAIL_SUCCESS;
  constructor(public payload: GenericProject) {}
}

export class LoadDetailsFail implements Action {
  readonly type = TypeActionEnum.LOAD_DETAIL_FAIL;
  constructor(public payload: any) { }
}

export class Create implements Action {
  readonly type = TypeActionEnum.CREATE;
  constructor(public payload: any) {}
}

export class CreateSuccess implements Action {
  readonly type = TypeActionEnum.CREATE_SUCCESS;
  constructor(public payload: GenericProject) { }
}

export class CreateFail implements Action {
  readonly type = TypeActionEnum.CREATE_FAIL;
  constructor(public payload: any) { }
}

export class Edit implements Action {
  readonly type = TypeActionEnum.EDIT;
  constructor(public payload: GenericProject) {}
}

export class EditSuccess implements Action {
  readonly type = TypeActionEnum.EDIT_SUCCESS;
  constructor(public payload: GenericProject) { }
}

export class EditFail implements Action {
  readonly type = TypeActionEnum.EDIT_FAIL;
  constructor(public payload: any) { }
}

export class Delete implements Action {
  readonly type = TypeActionEnum.DELETE;
  constructor(public payload: GenericProject) {}
}

export class DeleteSuccess implements Action {
  readonly type = TypeActionEnum.DELETE_SUCCESS;
  constructor(public payload: number) { }
}

export class DeleteFail implements Action {
  readonly type = TypeActionEnum.DELETE_FAIL;
  constructor(public payload: any) { }
}

export class SetSearch implements Action {
  readonly type = TypeActionEnum.SEARCH;
  constructor(public payload: string) {}
}

export class SetPagination implements Action {
  readonly type = TypeActionEnum.SET_PAGINATION;
  constructor(public payload: {pageIndex: number; pageSize: number}) {}
}

export class SortBy implements Action {
  readonly type = TypeActionEnum.SORTBY;
  constructor(public payload: string) {}
}

export class RestoreState implements Action {
  readonly type = TypeActionEnum.RESTORE;
}

export class Publish implements Action {
  readonly type = TypeActionEnum.PUBLISH;
  constructor(public payload: {projectPk: number, message: string}) { }
}

export class PublishSuccess implements Action {
  readonly type = TypeActionEnum.PUBLISH_SUCCESS;
  constructor(public payload: GenericProject) { }
}

export class PublishFail implements Action {
  readonly type = TypeActionEnum.PUBLISH_FAIL;
  constructor(public payload: any) { }
}

export class Settings implements Action {
  readonly type = TypeActionEnum.SETTINGS;
  constructor(public payload: GenericProject) { }
}

export class SettingsSuccess implements Action {
  readonly type = TypeActionEnum.SETTINGS_SUCCESS;
  constructor(public payload: GenericProject) { }
}

export class SettingsFail implements Action {
  readonly type = TypeActionEnum.SETTINGS_FAIL;
  constructor(public payload: any) { }
}

export type All
  = Load
  | LoadSuccess
  | LoadFail
  | LoadDetails
  | LoadDetailsSuccess
  | LoadDetailsFail
  | Create
  | CreateSuccess
  | CreateFail
  | Edit
  | EditSuccess
  | EditFail
  | Delete
  | DeleteSuccess
  | DeleteFail
  | SetSearch
  | SetPagination
  | SortBy
  | RestoreState
  | Publish
  | PublishSuccess
  | PublishFail
  | Settings
  | SettingsSuccess
  | SettingsFail
;
