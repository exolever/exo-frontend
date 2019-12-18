import { Action } from '@ngrx/store';
import { Circle } from '../../models/circle.model';

export enum TypeActionEnum {
  LOAD_CIRCLES =                '[Circles - circles] Load circles',
  LOAD_CIRCLES_SUCCESS =        '[Circles - circles] Load circles success',
  LOAD_CIRCLES_FAIL =           '[Circles - circles] Load circles fail',
  CREATE_CIRCLE =               '[Circles - circles] Create circle',
  CREATE_CIRCLE_SUCCESS =       '[Circles - circles] Create circle success',
  CREATE_CIRCLE_FAIL =          '[Circles - circles] Create circle fail',
  UPDATE_CIRCLE =               '[Circles - circles] Update circle',
  UPDATE_CIRCLE_SUCCESS =       '[Circles - circles] Update circle success',
  UPDATE_CIRCLE_FAIL =          '[Circles - circles] Update circle fail',
  LOAD_CIRCLE =                 '[Circles - circles] Load circle',
  LOAD_CIRCLE_SUCCESS =         '[Circles - circles] Load circle success',
  LOAD_CIRCLE_FAIL =            '[Circles - circles] Load circle fail',
  SELECT_CIRCLE =               '[Circles - circles] Select circles',
  LEAVE_CIRCLE =                '[Circles - circles] Leave circle',
  LEAVE_CIRCLE_SUCCESS =        '[Circles - circles] Leave circle success',
  LEAVE_CIRCLE_FAIL =           '[Circles - circles] Leave circle fail',
  JOIN_CIRCLE =                 '[Circles - circles] Join circle',
  JOIN_CIRCLE_SUCCESS =         '[Circles - circles] Join circle success',
  JOIN_CIRCLE_FAIL =            '[Circles - circles] Join circle fail',
  UPDATE_SUGGESTED_CIRCLES =    '[Circles - circles] Update suggested circles',
}

export class LoadCircles implements Action {
  readonly type = TypeActionEnum.LOAD_CIRCLES;
}

export class LoadCirclesSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_CIRCLES_SUCCESS;
  constructor(public payload: Circle[]) { }
}

export class LoadCirclesFail implements Action {
  readonly type = TypeActionEnum.LOAD_CIRCLES_FAIL;
  constructor(public payload: any) { }
}

export class SelectCircle implements Action {
  readonly type = TypeActionEnum.SELECT_CIRCLE;
  constructor(public payload: string) {}
}

export class UpdateCircle implements Action {
  readonly type = TypeActionEnum.UPDATE_CIRCLE;
  constructor(public payload: {slug: string, data: any}) { }
}

export class UpdateCircleFail implements Action {
  readonly type = TypeActionEnum.UPDATE_CIRCLE_FAIL;
  constructor(public payload: any) { }
}

export class UpdateCircleSuccess implements Action {
  readonly type = TypeActionEnum.UPDATE_CIRCLE_SUCCESS;
  constructor(public payload: Circle) { }
}

export class CreateCircle implements Action {
  readonly type = TypeActionEnum.CREATE_CIRCLE;
  constructor(public payload: any) { }
}

export class CreateCircleFail implements Action {
  readonly type = TypeActionEnum.CREATE_CIRCLE_FAIL;
  constructor(public payload: any) { }
}

export class CreateCircleSuccess implements Action {
  readonly type = TypeActionEnum.CREATE_CIRCLE_SUCCESS;
  constructor(public payload: Circle) { }
}

export class LoadCircle implements Action {
  readonly type = TypeActionEnum.LOAD_CIRCLE;
  constructor(public payload: string) { }
}

export class LoadCircleFail implements Action {
  readonly type = TypeActionEnum.LOAD_CIRCLE_FAIL;
  constructor(public payload: any) { }
}

export class LoadCircleSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_CIRCLE_SUCCESS;
  constructor(public payload: Circle) { }
}

export class LeaveCircle implements Action {
  readonly type = TypeActionEnum.LEAVE_CIRCLE;
  constructor(public payload: Circle) { }
}

export class LeaveCircleSuccess implements Action {
  readonly type = TypeActionEnum.LEAVE_CIRCLE_SUCCESS;
  constructor(public payload: Circle) { }
}

export class LeaveCircleFail implements Action {
  readonly type = TypeActionEnum.LEAVE_CIRCLE_FAIL;
}

export class JoinCircle implements Action {
  readonly type = TypeActionEnum.JOIN_CIRCLE;
  constructor(public payload: Circle) { }
}

export class JoinCircleSuccess implements Action {
  readonly type = TypeActionEnum.JOIN_CIRCLE_SUCCESS;
  constructor(public payload: Circle) { }
}

export class JoinCircleFail implements Action {
  readonly type = TypeActionEnum.JOIN_CIRCLE_FAIL;
}

export class UpdateSuggestedCircles implements Action {
  readonly type = TypeActionEnum.UPDATE_SUGGESTED_CIRCLES;
  constructor(public payload: Circle[]) { }
}

export type All
  = LoadCircles
  | LoadCirclesSuccess
  | LoadCirclesFail
  | CreateCircle
  | CreateCircleFail
  | CreateCircleSuccess
  | UpdateCircle
  | UpdateCircleFail
  | UpdateCircleSuccess
  | LoadCircle
  | LoadCircleFail
  | LoadCircleSuccess
  | SelectCircle
  | LeaveCircle
  | LeaveCircleSuccess
  | LeaveCircleFail
  | JoinCircle
  | JoinCircleSuccess
  | JoinCircleFail
  | UpdateSuggestedCircles
;

