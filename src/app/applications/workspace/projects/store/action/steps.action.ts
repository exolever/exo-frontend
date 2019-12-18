import { Action } from '@ngrx/store';
import { StepModel } from '../../models/step.model';

export enum TypeActionEnum {
  LOAD =                '[Workspace - Project - steps] Load',
  LOAD_SUCCESS =        '[Workspace - Project - steps] Load success',
  LOAD_FAIL =           '[Workspace - Project - steps] Load fail',
  EDIT =                '[Workspace - Project - steps] Edit',
  EDIT_SUCCESS =        '[Workspace - Project - steps] Edit success',
  EDIT_FAIL =           '[Workspace - Project - steps] Edit fail'
}

export class Load implements Action {
  readonly type = TypeActionEnum.LOAD;
  constructor(public payload: number) {}
}

export class LoadSuccess implements Action {
  readonly type = TypeActionEnum.LOAD_SUCCESS;
  constructor(public payload: StepModel[]) { }
}

export class LoadFail implements Action {
  readonly type = TypeActionEnum.LOAD_FAIL;
  constructor(public payload: any) { }
}

export class Edit implements Action {
  readonly type = TypeActionEnum.EDIT;
  constructor(public payload: {step: StepModel, projectPk: number }) {}
}

export class EditSuccess implements Action {
  readonly type = TypeActionEnum.EDIT_SUCCESS;
  constructor(public payload: StepModel) { }
}

export class EditFail implements Action {
  readonly type = TypeActionEnum.EDIT_FAIL;
  constructor(public payload: any) { }
}


export type All
  = Load
  | LoadSuccess
  | LoadFail
  | Edit
  | EditSuccess
  | EditFail;
