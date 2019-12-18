import { Action } from '@ngrx/store';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ProjectMember } from '@applications/workspace/projects/models/project-member.model';

export enum TypeActionEnum {
  LOAD_MEMBERS_GENERIC_PROJECT =             '[GProjects - Members] Load members ',
  LOAD_MEMBERS_GENERIC_PROJECT_SUCCESS =     '[GProjects - Members] Load members success',
  LOAD_MEMBERS_GENERIC_PROJECT_FAIL =        '[GProjects - Members] Load members fail',
  SEARCH_MEMBERS_GENERIC_PROJECT =           '[GProjects - Members] Set Search members',
  SET_PAGINATION_MEMBERS_GENERIC_PROJECT =   '[GProjects - Members] Set pagination params members',
}

export class LoadGProjectMembers implements Action {
  readonly type = TypeActionEnum.LOAD_MEMBERS_GENERIC_PROJECT;
  constructor(public payload: number) {}
}

export class LoadGProjectMembersSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_MEMBERS_GENERIC_PROJECT_SUCCESS;
  constructor(public payload: Pagination<ProjectMember>) { }
}

export class LoadGProjectMembersFail implements Action {
  readonly type = TypeActionEnum.LOAD_MEMBERS_GENERIC_PROJECT_FAIL;
  constructor(public payload: any) { }
}

export class SetSearchGProjectMembers implements Action {
  readonly type = TypeActionEnum.SEARCH_MEMBERS_GENERIC_PROJECT;
  constructor(public payload: {projectPk: number, searchBy: string}) {}
}

export class SetPaginationGProjectMembers implements Action {
  readonly type = TypeActionEnum.SET_PAGINATION_MEMBERS_GENERIC_PROJECT;
  constructor(public payload: {projectPk: number; pageIndex: number; pageSize: number}) {}
}

export type All
  = LoadGProjectMembers
  | LoadGProjectMembersSuccess
  | LoadGProjectMembersFail
  | SetSearchGProjectMembers
  | SetPaginationGProjectMembers
;
