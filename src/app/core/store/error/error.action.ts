import { Action } from '@ngrx/store';

export const ADD_GLOBAL_ERROR = '[Error] Global error';
export const CLEAR_STORE = '[Error] Clear store';

export class AddGlobalError implements Action {
  readonly type = ADD_GLOBAL_ERROR;
  constructor(public payload: any) {}
}

export class ClearStore implements Action {
  readonly type = CLEAR_STORE;
  constructor() {}
}

export type ErrorActions = AddGlobalError
  | ClearStore;
