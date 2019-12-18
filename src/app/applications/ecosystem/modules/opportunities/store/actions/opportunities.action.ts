import { Action } from '@ngrx/store';

import { Pagination } from '@core/interfaces/pagination.interface';

import { OpportunityModel } from '../../models/opportunity.model';

export const LOAD_OPPORTUNITIES_ALL =             '[Opportunities] Load Opportunities';
export const LOAD_OPPORTUNITIES_ALL_SUCCESS =     '[Opportunities] Load Success Opportunities';
export const LOAD_OPPORTUNITIES_ALL_FAIL =        '[Opportunities] Load Fail Opportunities';
export const LOAD_OPPORTUNITIES_BY_YOU =          '[Opportunities] Load By You Opportunities';
export const LOAD_OPPORTUNITIES_BY_YOU_SUCCESS =  '[Opportunities] Load By You Success Opportunities';
export const LOAD_OPPORTUNITIES_BY_YOU_FAIL =     '[Opportunities] Load By You Fail Opportunities';
export const LOAD_OPPORTUNITY =                   '[Opportunities] Load Opportunity';
export const LOAD_OPPORTUNITY_SUCCESS =           '[Opportunities] Load Success Opportunity';
export const LOAD_OPPORTUNITY_FAIL =              '[Opportunities] Load Fail Opportunity';
export const CREATE_OPPORTUNITY =                 '[Opportunities - Create] Create Opportunity';
export const CREATE_OPPORTUNITY_SUCCESS =         '[Opportunities - Create] Create Opportunity Success';
export const CREATE_OPPORTUNITY_FAIL =            '[Opportunities - Create] Create Opportunity Fail';
export const APPLY_OPPORTUNITY =                  '[Opportunities - Apply] Apply Opportunity';
export const APPLY_OPPORTUNITY_SUCCESS =          '[Opportunities - Apply] Apply Opportunity Success';
export const APPLY_OPPORTUNITY_FAIL =             '[Opportunities - Apply] Apply Opportunity Fail';
export const WS_CONNECT_OPPORTUNITY =             '[Opportunities - WS] Connect';
export const OPPORTUNITY_USERS_CONNECTED =        '[Opportunities - WS] Users Connected';
export const DISCONNECT_WS_OPPORTUNITY =          '[Opportunities - WS] Disconnect';
export const STATUS_WS_OPPORTUNITY =              '[Opportunities - WS] Status connection';
export const DELETE_OPPORTUNITY =                 '[Opportunities - Delete] Delete Opportunity';
export const DELETE_OPPORTUNITY_SUCCESS =         '[Opportunities - Delete] Delete Opportunity Success';
export const DELETE_OPPORTUNITY_FAIL =            '[Opportunities - Delete] Delete Opportunity Fail';
export const EDIT_OPPORTUNITY =                   '[Opportunities - Edit] Edit Opportunity';
export const EDIT_OPPORTUNITY_SUCCESS =           '[Opportunities - Edit] Edit Opportunity Success';
export const EDIT_OPPORTUNITY_FAIL =              '[Opportunities - Edit] Edit Opportunity Fail';
export const PREVIEW_OPPORTUNITY =                '[Opportunities - Preview] Preview Opportunity';
export const PREVIEW_OPPORTUNITY_SUCCESS =        '[Opportunities - Preview] Preview Opportunity Success';
export const PREVIEW_OPPORTUNITY_FAIL =           '[Opportunities - Preview] Preview Opportunity Fail';
export const SET_PAGINATION =          '[Opportunities - Pagination] Set pagination params';
export const SET_PAGINATION_ADMIN =    '[Opportunities - Pagination] Set pagination params list of administration';
export const SEARCH =                  '[Opportunities - Search] Set Search';
export const SEARCH_ADMIN =            '[Opportunities - Search] Set Search in list of administration';
export const LOAD_ADVISORY_CALL =             '[Opportunities] Load Advisory call';
export const LOAD_ADVISORY_CALL_SUCCESS =     '[Opportunities] Load Success Advisory call';
export const LOAD_ADVISORY_CALL_FAIL =        '[Opportunities] Load Fail Advisory call';


export class LoadOpportunities implements Action {
  readonly type = LOAD_OPPORTUNITIES_ALL;
}

export class LoadOpportunitiesSuccess implements Action {
  readonly type = LOAD_OPPORTUNITIES_ALL_SUCCESS;
  constructor(public payload: Pagination<OpportunityModel>) { }
}

export class LoadOpportunitiesFail implements Action {
  readonly type = LOAD_OPPORTUNITIES_ALL_FAIL;
  constructor(public payload: any) { }
}

export class LoadAdminOpportunities implements Action {
  readonly type = LOAD_OPPORTUNITIES_BY_YOU;
}

export class LoadAdminOpportunitiesSuccess implements Action {
  readonly type = LOAD_OPPORTUNITIES_BY_YOU_SUCCESS;
  constructor(public payload: Pagination<OpportunityModel>) {}
}

export class LoadAdminOpportunitiesFail implements Action {
  readonly type = LOAD_OPPORTUNITIES_BY_YOU_FAIL;
  constructor(public payload: any) { }
}

export class LoadOpportunity implements Action {
  readonly type = LOAD_OPPORTUNITY;
  constructor(public pk: string) { }
}

export class LoadOpportunitySuccess implements Action {
  readonly type = LOAD_OPPORTUNITY_SUCCESS;
  constructor(public payload: OpportunityModel) { }
}

export class LoadOpportunityFail implements Action {
  readonly type = LOAD_OPPORTUNITY_FAIL;
  constructor(public payload: any) { }
}

export class CreateOpportunity implements Action {
  readonly type = CREATE_OPPORTUNITY;
  constructor(public payload: {
    data: any,
    baseUrls: {list: string, viewDetails: string}
  }) { }
}

export class CreateOpportunityFail implements Action {
  readonly type = CREATE_OPPORTUNITY_FAIL;
  constructor(public payload: any) { }
}

export class CreateOpportunitySuccess implements Action {
  readonly type = CREATE_OPPORTUNITY_SUCCESS;
  constructor(public payload: OpportunityModel) { }
}

export class PreviewOpportunity implements Action {
  readonly type = PREVIEW_OPPORTUNITY;
  constructor(public payload: {
    data: any,
    baseUrls: {list: string, viewDetails: string}
  }) { }
}

export class PreviewOpportunityFail implements Action {
  readonly type = PREVIEW_OPPORTUNITY_FAIL;
  constructor(public payload: any) { }
}

export class PreviewOpportunitySuccess implements Action {
  readonly type = PREVIEW_OPPORTUNITY_SUCCESS;
  constructor(public payload: OpportunityModel) { }
}

export class ApplyOpportunity implements Action {
  readonly type = APPLY_OPPORTUNITY;
  constructor(public payload: {pkOpportunity: number, dataToSend: any }) { }
}

export class ApplyOpportunityFail implements Action {
  readonly type = APPLY_OPPORTUNITY_FAIL;
  constructor(public payload: any) { }
}

export class ApplyOpportunitySuccess implements Action {
  readonly type = APPLY_OPPORTUNITY_SUCCESS;
  constructor(public payload: OpportunityModel) { }
}

export class ConnectWsOpportunity implements Action {
  readonly type = WS_CONNECT_OPPORTUNITY;
  // payload = uuid opportunity
  constructor(public payload: {uuid: string, isAdmin: boolean, pkTalk?: string}) { }
}

export class StatusConnection implements Action {
  readonly type = STATUS_WS_OPPORTUNITY;
  constructor(public payload: boolean) { }
}

export class DisconnectWsOpportunity implements Action {
  readonly type = DISCONNECT_WS_OPPORTUNITY;
}

export class DeleteOpportunity implements Action {
  readonly type = DELETE_OPPORTUNITY;
  constructor(public payload: {pkOpportunity: number,  message?: string, urlToNavigate?: string}) { }
}

export class DeleteOpportunityFail implements Action {
  readonly type = DELETE_OPPORTUNITY_FAIL;
}

export class DeleteOpportunitySuccess implements Action {
  readonly type = DELETE_OPPORTUNITY_SUCCESS;
  constructor(public pkOpportunity: number) { }
}

export class EditOpportunity implements Action {
  readonly type = EDIT_OPPORTUNITY;
  constructor(public payload: { opportunityPk: number, data: any, baseUrlViewDetails: string }) { }
}

export class EditOpportunityFail implements Action {
  readonly type = EDIT_OPPORTUNITY_FAIL;
  constructor(public payload: OpportunityModel) { }
}

export class EditOpportunitySuccess implements Action {
  readonly type = EDIT_OPPORTUNITY_SUCCESS;
  constructor(public payload: OpportunityModel) { }
}

export class SetPagination implements Action {
  readonly type = SET_PAGINATION;
  constructor(public payload: {pageIndex: number; pageSize: number}) {}
}

export class SetPaginationAdmin implements Action {
  readonly type = SET_PAGINATION_ADMIN;
  constructor(public payload: {pageIndex: number; pageSize: number}) {}
}

export class SetSearch implements Action {
  readonly type = SEARCH;
  constructor(public payload: string) {}
}

export class SetSearchAdmin implements Action {
  readonly type = SEARCH_ADMIN;
  constructor(public payload: string) {}
}

export class LoadAdvisoryCall implements Action {
  readonly type = LOAD_ADVISORY_CALL;
  constructor(public payload: number) { }
}

export class LoadAdvisoryCallSuccess implements Action {
  readonly type = LOAD_ADVISORY_CALL_SUCCESS;
  constructor(public payload: Pagination<OpportunityModel>) {}
}

export class LoadAdvisoryCallFail implements Action {
  readonly type = LOAD_ADVISORY_CALL_FAIL;
  constructor(public payload: any) { }
}

export type All
  = LoadOpportunities
  | LoadOpportunitiesSuccess
  | LoadOpportunitiesFail
  | LoadAdminOpportunities
  | LoadAdminOpportunitiesSuccess
  | LoadAdminOpportunitiesFail
  | LoadOpportunity
  | LoadOpportunitySuccess
  | LoadOpportunityFail
  | CreateOpportunity
  | CreateOpportunitySuccess
  | CreateOpportunityFail
  | PreviewOpportunity
  | PreviewOpportunitySuccess
  | PreviewOpportunityFail
  | ApplyOpportunity
  | ApplyOpportunitySuccess
  | ApplyOpportunityFail
  | ConnectWsOpportunity
  | DisconnectWsOpportunity
  | StatusConnection
  | DeleteOpportunity
  | DeleteOpportunityFail
  | DeleteOpportunitySuccess
  | EditOpportunity
  | EditOpportunityFail
  | EditOpportunitySuccess
  | SetPagination
  | SetPaginationAdmin
  | SetSearch
  | SetSearchAdmin
  | LoadAdvisoryCall
  | LoadAdvisoryCallSuccess
  | LoadAdvisoryCallFail
;


