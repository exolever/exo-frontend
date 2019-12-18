import { Action } from '@ngrx/store';
import { IBreadCrumb } from '@applications/breadcrumb/store/breadcrumb.reducers';

export enum BreadCrumbActions {
  UPDATE_ROOT = '[BreadCrumb] Update root',
  UPDATE = '[BreadCrumb] Update',
  RESET = '[BreadCrumb] Reset',
  POP_CRUMB = '[BreadCrumb] Pop crumb',
  PUSH_CRUMB = '[BreadCrumb] Push crumb'
}

export class UpdateRoot implements Action {
  readonly type = BreadCrumbActions.UPDATE_ROOT;
  constructor(public payload: IBreadCrumb | void) { }
}

export class Update implements Action {
  readonly type = BreadCrumbActions.UPDATE;
  constructor(public payload: IBreadCrumb) { }
}

export class Reset implements Action {
  readonly type = BreadCrumbActions.RESET;
}

export class PopCrumb implements Action {
  readonly type = BreadCrumbActions.POP_CRUMB;
}

export class PushCrumb implements Action {
  readonly type = BreadCrumbActions.PUSH_CRUMB;
  constructor(public payload: { label: string }) { }
}

export type All
  = UpdateRoot
  | Update
  | Reset
  | PopCrumb
  | PushCrumb;
