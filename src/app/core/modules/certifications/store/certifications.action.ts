import { Action } from '@ngrx/store';

import { CertificationModel } from '../models';

export const GET_CERTIFICATIONS = '[Certifications] GET Certifications';
export const GET_CERTIFICATIONS_SUCCESS = '[Certifications] Get Certifications Success';
export const GET_CERTIFICATIONS_FAIL = '[Certifications] Get Certifications Fail';

export class GetCertifications implements Action {
  readonly type = GET_CERTIFICATIONS;
}

export class GetCertificationsSuccess implements Action {
  readonly type = GET_CERTIFICATIONS_SUCCESS;
  constructor(public payload: CertificationModel[]) {}
}

export class GetCertificationsFail implements Action {
  readonly type = GET_CERTIFICATIONS_FAIL ;
  constructor(public payload: any) {}
}

export type CertificationsActions
  = GetCertifications
  | GetCertificationsSuccess
  | GetCertificationsFail
;
