import { Action } from '@ngrx/store';
import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';
import { OpportunityApplicantModel } from '@opportunities/models/opportunity-applicant.model';

export const OPPORTUNITY_SELECT_APPLICANT =         '[Opportunities] Select Applicant';
export const OPPORTUNITY_SELECT_APPLICANT_SUCCESS = '[Opportunities] Select Applicant Success';
export const OPPORTUNITY_SELECT_APPLICANT_FAIL =    '[Opportunities] Select Applicant Fail';
export const OPPORTUNITY_REJECT_APPLICANT =         '[Opportunities] Reject Applicant';
export const OPPORTUNITY_REJECT_APPLICANT_SUCCESS = '[Opportunities] Reject Applicant Success';
export const OPPORTUNITY_REJECT_APPLICANT_FAIL =    '[Opportunities] Reject Applicant Fail';
export const CLOSE_OPPORTUNITY =                    '[Opportunities - Close] Close';
export const CLOSE_OPPORTUNITY_SUCCESS =            '[Opportunities - Close] Close Success';
export const CLOSE_OPPORTUNITY_FAIL =               '[Opportunities - Close] Close Fail';
export const REOPEN_OPPORTUNITY =                   '[Opportunities - Reopen] Reopen';
export const REOPEN_OPPORTUNITY_SUCCESS =           '[Opportunities - Reopen] Reopen Success';
export const REOPEN_OPPORTUNITY_FAIL =              '[Opportunities - Reopen] Reopen Fail';
export const LOAD_OPPORTUNITY_ADMIN =               '[Opportunities - Admin] Load Admin';
export const LOAD_OPPORTUNITY_ADMIN_SUCCESS =       '[Opportunities - Admin] Load Admin Success';
export const LOAD_OPPORTUNITY_ADMIN_FAIL =          '[Opportunities - Admin] Load Admin Fail';
export const EDIT_SOW =                             '[Opportunities - SOW] Edit Sow';
export const EDIT_SOW_SUCCESS =                     '[Opportunities - SOW] Edit Sow Success';
export const EDIT_SOW_FAIL =                        '[Opportunities - SOW] Edit Sow Fail';

export class OpportunitySelectAplicant implements Action {
  readonly type = OPPORTUNITY_SELECT_APPLICANT;
  constructor(public payload: {applicant: OpportunityApplicantModel, sow: any, message?: string}) { }
}
export class OpportunitySelectApplicantSuccess implements Action {
  readonly type = OPPORTUNITY_SELECT_APPLICANT_SUCCESS;
  constructor(public payload: { opportunity: OpportunityModel, applicant: OpportunityApplicantModel }) { }
}

export class OpportunitySelectApplicantFail implements Action {
  readonly type = OPPORTUNITY_SELECT_APPLICANT_FAIL;
  constructor(public payload: any) { }
}

export class OpportunityRejectAplicant implements Action {
  readonly type = OPPORTUNITY_REJECT_APPLICANT;
  constructor(public payload: {applicant: OpportunityApplicantModel, message?: string}) { }
}

export class OpportunityRejectApplicantSuccess implements Action {
  readonly type = OPPORTUNITY_REJECT_APPLICANT_SUCCESS;
  constructor(public payload: OpportunityModel) { }
}

export class OpportunityRejectApplicantFail implements Action {
  readonly type = OPPORTUNITY_REJECT_APPLICANT_FAIL;
  constructor(public payload: any) { }
}

export class CloseOpportunity implements Action {
  readonly type = CLOSE_OPPORTUNITY;
  constructor(public payload: { pk: number, message?: string }) { }
}

export class CloseOpportunitySuccess implements Action {
  readonly type = CLOSE_OPPORTUNITY_SUCCESS;
  constructor(public payload: any) { }
}

export class ReopenOpportunityFail implements Action {
  readonly type = REOPEN_OPPORTUNITY_FAIL;
  constructor(public payload: any) { }
}

export class ReopenOpportunity implements Action {
  readonly type = REOPEN_OPPORTUNITY;
  constructor(public payload: { pk: number, deadline: string }) { }
}

export class ReopenOpportunitySuccess implements Action {
  readonly type = REOPEN_OPPORTUNITY_SUCCESS;
  constructor(public payload: any) { }
}

export class CloseOpportunityFail implements Action {
  readonly type = CLOSE_OPPORTUNITY_FAIL;
  constructor(public payload: any) { }
}

export class LoadOpportunityAdmin implements Action {
  readonly type = LOAD_OPPORTUNITY_ADMIN;
  constructor(public pk: string) { }
}

export class LoadOpportunityAdminSuccess implements Action {
  readonly type = LOAD_OPPORTUNITY_ADMIN_SUCCESS;
  constructor(public payload: OpportunityModel) { }
}

export class LoadOpportunityAdminFail implements Action {
  readonly type = LOAD_OPPORTUNITY_ADMIN_FAIL;
  constructor(public payload: any) { }
}

export class EditSow implements Action {
  readonly type = EDIT_SOW;
  constructor(public payload: {applicant: OpportunityApplicantModel, sow: any, message?: string}) { }
}

export class EditSowSuccess implements Action {
  readonly type = EDIT_SOW_SUCCESS;
  constructor(public payload: any) { }
}

export class EditSowFail implements Action {
  readonly type = EDIT_SOW_FAIL;
  constructor(public payload: any) { }
}

export type All
  = LoadOpportunityAdmin
  | LoadOpportunityAdminSuccess
  | LoadOpportunityAdminFail
  | OpportunitySelectAplicant
  | OpportunitySelectApplicantSuccess
  | OpportunitySelectApplicantFail
  | OpportunityRejectAplicant
  | OpportunityRejectApplicantSuccess
  | OpportunityRejectApplicantFail
  | CloseOpportunity
  | CloseOpportunitySuccess
  | CloseOpportunityFail
  | ReopenOpportunity
  | ReopenOpportunitySuccess
  | ReopenOpportunityFail;
