import { Action } from '@ngrx/store';
import { Team } from '../../models/team.model';

export enum TypeActionEnum {
  LOAD =                '[Workspace - Project - team] Load',
  LOAD_SUCCESS =        '[Workspace - Project - team] Load success',
  LOAD_FAIL =           '[Workspace - Project - team] Load fail',
  LOAD_DETAIL =         '[Workspace - Project - team] Load details',
  LOAD_DETAIL_SUCCESS = '[Workspace - Project - team] Load details success',
  LOAD_DETAIL_FAIL =    '[Workspace - Project - team] Load details fail',
  CREATE =              '[Workspace - Project - team] Create',
  CREATE_SUCCESS =      '[Workspace - Project - team] Create success',
  CREATE_FAIL =         '[Workspace - Project - team] Create fail',
  EDIT =                '[Workspace - Project - team] Edit',
  EDIT_SUCCESS =        '[Workspace - Project - team] Edit success',
  EDIT_FAIL =           '[Workspace - Project - team] Edit fail',
  DELETE =              '[Workspace - Project - team] Delete',
  DELETE_SUCCESS =      '[Workspace - Project - team] Delete success',
  DELETE_FAIL =         '[Workspace - Project - team] Delete fail',
  UNSELECT =            '[Workspace - Project - team - user] Unselect',
  UNSELECT_SUCCESS =    '[Workspace - Project - team - user] Unselect success',
  UNSELECT_FAIL =       '[Workspace - Project - team - user] Unselect fail',
  SELECT =              '[Workspace - Project - team - user] Select',
  SELECT_SUCCESS =      '[Workspace - Project - team - user] Select success',
  SELECT_FAIL =         '[Workspace - Project - team - user] Select fail',
  MOVE =                '[Workspace - Project - team - user] Move',
  MOVE_SUCCESS =        '[Workspace - Project - team - user] Move success',
  MOVE_FAIL =           '[Workspace - Project - team - user] Move fail'
}

export class Load implements Action {
  readonly type = TypeActionEnum.LOAD;
  constructor(public payload: number) {}
}

export class LoadSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_SUCCESS;
  constructor(public payload: Team[]) { }
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
  constructor(public payload: Team) {}
}

export class LoadDetailsFail implements Action {
  readonly type = TypeActionEnum.LOAD_DETAIL_FAIL;
  constructor(public payload: any) { }
}

export class Create implements Action {
  readonly type = TypeActionEnum.CREATE;
  constructor(public payload: {team: Team, projectPk: number}) {}
}

export class CreateSuccess implements Action {
  readonly type = TypeActionEnum.CREATE_SUCCESS;
  constructor(public payload: Team) { }
}

export class CreateFail implements Action {
  readonly type = TypeActionEnum.CREATE_FAIL;
  constructor(public payload: any) { }
}

export class Edit implements Action {
  readonly type = TypeActionEnum.EDIT;
  constructor(public payload: {team: Team, projectPk: number}) {}
}

export class EditSuccess implements Action {
  readonly type = TypeActionEnum.EDIT_SUCCESS;
  constructor(public payload: Team) { }
}

export class EditFail implements Action {
  readonly type = TypeActionEnum.EDIT_FAIL;
  constructor(public payload: any) { }
}

export class Delete implements Action {
  readonly type = TypeActionEnum.DELETE;
  constructor(public payload: {team: Team, projectPk: number}) {}
}

export class DeleteSuccess implements Action {
  readonly type = TypeActionEnum.DELETE_SUCCESS;
  constructor(public payload: number) { }
}

export class DeleteFail implements Action {
  readonly type = TypeActionEnum.DELETE_FAIL;
  constructor(public payload: any) { }
}

export class Unselect implements Action {
  readonly type = TypeActionEnum.UNSELECT;
  constructor(public payload: {team: Team, projectPk: number, teamRolePk: number}) {}
}

export class UnselectSuccess implements Action {
  readonly type = TypeActionEnum.UNSELECT_SUCCESS;
  constructor(public payload: Team) { }
}

export class UnselectFail implements Action {
  readonly type = TypeActionEnum.UNSELECT_FAIL;
  constructor(public payload: any) { }
}

export class SelectPeople implements Action {
  readonly type = TypeActionEnum.SELECT;
  constructor(public payload: {teamPk: number, projectPk: number, data: number[]}) {}
}

export class SelectPeopleSuccess implements Action {
  readonly type = TypeActionEnum.SELECT_SUCCESS;
  constructor(public payload: Team) { }
}

export class SelectPeopleFail implements Action {
  readonly type = TypeActionEnum.SELECT_FAIL;
  constructor(public payload: any) { }
}

export class MoveUser implements Action {
  readonly type = TypeActionEnum.MOVE;
  constructor(public payload: {teamPk: number, projectPk: number, teamUserRolePk: number, newTeamPk: number}) {}
}

export class MoveUserSuccess implements Action {
  readonly type = TypeActionEnum.MOVE_SUCCESS;
  constructor(public payload: Team[]) { }
}

export class MoveUserFail implements Action {
  readonly type = TypeActionEnum.MOVE_FAIL;
  constructor(public payload: any) { }
}

export type All
  = Load
  | LoadSuccess
  | LoadFail
  | Create
  | CreateSuccess
  | CreateFail
  | Edit
  | EditSuccess
  | EditFail
  | Delete
  | DeleteSuccess
  | DeleteFail
  | LoadDetails
  | LoadDetailsSuccess
  | LoadDetailsFail
  | Unselect
  | UnselectSuccess
  | UnselectFail
  | SelectPeople
  | SelectPeopleSuccess
  | SelectPeopleFail
  | MoveUser
  | MoveUserSuccess
  | MoveUserFail;
