import { Action } from '@ngrx/store';
import { GenericProject } from '@applications/workspace/projects/models/project.model';


export enum TypeActionEnum {
  INIT_GPROJECT =         '[GenericProject] Init GenericProject',
  GET_GPROJECT =          '[GenericProject] Get GenericProject',
  GET_GPROJECT_SUCCESS =  '[GenericProject] Get GenericProject Success',
  GET_GPROJECT_FAIL =     '[GenericProject] Get GenericProject Fail',
}

export class GetGProject implements Action {
  readonly type = TypeActionEnum.GET_GPROJECT;
  constructor(public payload: number) {}
}

export class GetGProjectSuccess implements Action {
  readonly type = TypeActionEnum.GET_GPROJECT_SUCCESS;
  constructor(public payload: GenericProject) { }
}

export class GetGProjectFail implements Action {
  readonly type = TypeActionEnum.GET_GPROJECT_FAIL;
  constructor(public payload: any) {}
}

export class InitGProject implements Action {
  readonly type = TypeActionEnum.INIT_GPROJECT;
  constructor(public payload: GenericProject) { }
}

export type GProjectsActions =
  | GetGProject
  | GetGProjectSuccess
  | GetGProjectFail
  | InitGProject;
