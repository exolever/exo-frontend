import { Action } from '@ngrx/store';
import { RoleCategoryModel } from '@core/modules/roles/models';

export const GET_ROLES = '[Roles] GET Roles';
export const GET_ROLES_SUCCESS = '[Roles] Get Roles Success';
export const GET_ROLES_FAIL = '[Roles] Get Roles Fail';

export class GetRoles implements Action {
  readonly type = GET_ROLES;
}

export class GetRolesSuccess implements Action {
  readonly type = GET_ROLES_SUCCESS;
  constructor(public payload: RoleCategoryModel[]) {}
}

export class GetRolesFail implements Action {
  readonly type = GET_ROLES_FAIL;
  constructor(public payload: any) { }
}

export type RolesAction
  = GetRoles
  | GetRolesSuccess
  | GetRolesFail;
