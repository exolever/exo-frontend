import { Action } from '@ngrx/store';
import { ProjectModel } from '@applications/service/old-project/models/project.model';

export const INIT_PROJECT = '[Project] Init Project';
export const GET_PROJECT = '[Project] Get Project';
export const GET_PROJECT_SUCCESS = '[Project] Get Project Success';
export const GET_PROJECT_FAIL = '[Project] Get Project Fail';

export class GetProject implements Action {
  readonly type = GET_PROJECT;
  constructor(public payload: string) {}
}

export class GetProjectSuccess implements Action {
  readonly type = GET_PROJECT_SUCCESS;
  constructor(public payload: ProjectModel) { }
}

export class GetProjectFail implements Action {
  readonly type = GET_PROJECT_FAIL;
  constructor(public payload: any) {}
}

export class InitProject implements Action {
  readonly type = INIT_PROJECT;
  constructor(public payload: ProjectModel) { }
}

export type ProjectsActions =
  | GetProject
  | GetProjectSuccess
  | GetProjectFail
  | InitProject;
