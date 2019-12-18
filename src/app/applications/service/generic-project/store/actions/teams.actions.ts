import { Action } from '@ngrx/store';
import { Team as TeamModel } from '@applications/workspace/projects/models/team.model';

export enum TypeActionEnum {
  LOAD_GPROJECT_TEAMS_SUCCESS = '[Teams] Load GProject Teams Success',
  LOAD_GPROJECT_TEAMS_FAIL =    '[Teams] Load GProject Teams Fail',
  SET_GROJECT_TEAMS_SELECTED =  '[Teams] Set GProject Team Selected',
}

export class LoadGProjectTeamsSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_GPROJECT_TEAMS_SUCCESS;
  constructor(public payload: TeamModel[]) { }
}

export class LoadGProjectTeamsFail implements Action {
  readonly type = TypeActionEnum.LOAD_GPROJECT_TEAMS_FAIL;
  constructor(public payload: any) {}
}

export class SetGProjectTeamSelected implements Action {
  readonly type = TypeActionEnum.SET_GROJECT_TEAMS_SELECTED;
  constructor(public payload: number) { }
}


export type TeamsActions =
  | LoadGProjectTeamsSuccess
  | LoadGProjectTeamsFail
  | SetGProjectTeamSelected
;
