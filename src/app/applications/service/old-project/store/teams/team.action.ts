import { Action } from '@ngrx/store';

import { TeamModel } from '../../models/team.model';

export const LOAD_TEAMS = '[Teams] Load';
export const LOAD_TEAMS_SUCCESS = '[Teams] Load Success';
export const LOAD_TEAMS_FAIL = '[Teams] Load Fail';
export const SET_TEAM_SELECTED = '[Teams] Set Team Selected';

export class LoadTeams implements Action {
  readonly type = LOAD_TEAMS;
  constructor(public payload: string) { }
}

export class LoadTeamsSuccess implements Action {
  readonly type = LOAD_TEAMS_SUCCESS;
  constructor(public payload: TeamModel[]) { }
}

export class LoadTeamsFail implements Action {
  readonly type = LOAD_TEAMS_FAIL;
  constructor(public payload: any) {}
}

export class SetTeamSelected implements Action {
  readonly type = SET_TEAM_SELECTED;
  constructor(public payload: string) { }
}


export type TeamsActions =
  | LoadTeams
  | LoadTeamsSuccess
  | LoadTeamsFail
  | SetTeamSelected;

