import { Action } from '@ngrx/store';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';
import { UserModel } from '@core/models/user/user.model';

export enum TypeActionEnum {
  LOAD_SESIONS =         '[Service - swarm session] Load sessions',
  LOAD_SESIONS_SUCCESS = '[Service - swarm session] Load sessions success',
  LOAD_SESIONS_FAIL =    '[Service - swarm session] Load sessions fail',
  SELECT_SESSION =       '[Service - swarm session] Select session',
  ADD_ADIVSORS =         '[Service - swarm session] Add advisors',
  ADD_ADIVSORS_SUCCESS = '[Service - swarm session] Add advisors success',
  ADD_ADIVSORS_FAIL =    '[Service - swarm session] Add advisors fail',
  ADD_USERS =            '[Service - swarm session] Initialize connected users',
  ADD_USERS_SUCCESS =    '[Service - swarm session] Initialize connected users success',
  ADD_USERS_FAIL =       '[Service - swarm session] Initialize connected users fail',
  ADD_USER =             '[Service - swarm session] Add connected user',
  REMOVE_USER =          '[Service - swarm session] Remove connected users'
}

export class LoadSessions implements Action {
  readonly type = TypeActionEnum.LOAD_SESIONS;
  constructor(
    public payload: {pkTeam: number, pkProject: number}) {}
}

export class LoadSessionsSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_SESIONS_SUCCESS;
  constructor(public payload: SwarmSession[]) { }
}

export class LoadSessionsFail implements Action {
  readonly type = TypeActionEnum.LOAD_SESIONS_FAIL;
  constructor(public payload: any) { }
}

export class AddAdvisors implements Action {
  readonly type = TypeActionEnum.ADD_ADIVSORS;
  constructor(
    public payload: {pkTeam: number, pkProject: number, pkSession: number}) {}
}

export class AddAdvisorsSuccess implements Action {
  readonly type = TypeActionEnum.ADD_ADIVSORS_SUCCESS;
  constructor(public payload: {advisors: UserModel[], pkSession: number}) { }
}

export class AddAdvisorsFail implements Action {
  readonly type = TypeActionEnum.ADD_ADIVSORS_FAIL;
  constructor(public payload: any) { }
}

export class SelectSession implements Action {
  readonly type = TypeActionEnum.SELECT_SESSION;
  constructor(public payload: {pkTeam: number, pkProject: number, pkSession: number}) {}
}

export class AddConnectedUsers implements Action {
  readonly type = TypeActionEnum.ADD_USER;
  constructor(public payload: string) {}
}

export class RemoveConnectedUsers implements Action {
  readonly type = TypeActionEnum.REMOVE_USER;
  constructor(public payload: string) {}
}

export class InitConnectedUsers implements Action {
  readonly type = TypeActionEnum.ADD_USERS;
}

export class InitConnectedUsersSuccess implements Action {
  readonly type = TypeActionEnum.ADD_USERS_SUCCESS;
  constructor(public payload: string[]) {}
}

export class InitConnectedUsersFail implements Action {
  readonly type = TypeActionEnum.ADD_USERS_FAIL;
  constructor(public payload: any) {}
}

export type All
  = LoadSessions
  | LoadSessionsSuccess
  | LoadSessionsFail
  | SelectSession
  | AddAdvisors
  | AddAdvisorsSuccess
  | AddAdvisorsFail
  | AddConnectedUsers
  | RemoveConnectedUsers
  | InitConnectedUsers
  | InitConnectedUsersSuccess
  | InitConnectedUsersFail;
