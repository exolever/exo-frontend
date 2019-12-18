export enum OpportunityActionEnum {
  O = <any>'APPLY_OPEN',
  E = <any>'EDIT',
  S = <any>'SEND',
  R = <any>'REMOVE',
  T = <any>'ASSIGN',
  K = <any>'ACCEPT',
  N = <any>'DECLINE',
  C = <any>'CLOSE',
  D = <any>'REJECT',
  A = <any>'CREATE',
  H = <any>'EDIT_SOW',
  V = <any>'VIEW_SOW',
  G = <any>'REOPEN'
}

export enum OpportunityStatusEnum {
  L = <any>'CLOSED',
  X = <any>'DRAFT',
  R = <any>'REQUESTED',
  M = <any>'REMOVED'
}

export enum OpportunityUserStatusEnum {
  L = <any>'CLOSED',
  X = <any>'DRAFT',
  R = <any>'REQUESTED',
  M = <any>'REMOVED',
  F = <any>'APPLICANT_DRAFT',
  B = <any>'APPLICANT_REQUESTED',
  J = <any>'APPLICANT_REJECTED',
  V = <any>'APPLICANT_REMOVED',
  G = <any>'APPLICANT_SELECTED',
  A = <any>'APPLICANT_COMPLETED',
  C = <any>'APPLICANT_FEEDBACK_REQUESTER',
  E = <any>'APPLICANT_FEEDBACK_APP',
  H = <any>'APPLICANT_FEEDBACK_READY'
}

export enum OpportunityApplicantStatusEnum {
  F = <any>'APPLICANT_DRAFT',
  B = <any>'APPLICANT_REQUESTED',
  J = <any>'APPLICANT_REJECTED',
  V = <any>'APPLICANT_REMOVED',
  G = <any>'APPLICANT_SELECTED',
  A = <any>'APPLICANT_COMPLETED',
  C = <any>'APPLICANT_FEEDBACK_REQUESTER',
  E = <any>'APPLICANT_FEEDBACK_APP',
  H = <any>'APPLICANT_FEEDBACK_READY'
}

export enum ApplicantActionsEnum {
  F = <any>'FEEDBACK_CREATE',
}


export const CURRENCY_DOLLAR = 'USD';
export enum OpportunityFiatCurrencyEnum {
  D = <any>'USD',
  E = <any>'EUR'
}

export const CURRENCY_EXO = 'EXOS';

export enum AllCurrenciesEnum {
  D = <any>'USD',
  E = <any>'EUR',
  X = <any>'EXOS'
}

export enum OpportunityTarget {
  OPEN = 'O',
  TARGETED = 'F'
}

export enum OpportunityMode {
  toBeDefined = 'T',
  onSite = 'S',
  online = 'L'
}

export enum OpportunityTypePayment {
  single,
  combined,
  toBeDefined
}

export enum OpportunityDurationUnit {
  MINUTE = 'T',
  HOUR = 'H',
  DAY = 'D',
  WEEK = 'W',
  MONTH = 'M'
}

export enum AdvisoryCallDurationUnit {
  MINUTE = 'T',
  HOUR = 'H',
}

export enum RoleCode {
  EXO_SPEAKER = 'S',
  EXO_ADVISOR = 'EF',
  EXO_COACH = 'X',
  EXO_HEAD_COACH = 'M',
  EXO_DISRUPTOR = 'D',
  EXO_CONSULTANT = 'EC',
  EXO_TRAINER = 'TR',
  OTHER = 'OT'
}

export const ROLES = [
  {name: 'ExO Speaker', code: RoleCode.EXO_SPEAKER},
  {name: 'ExO Advisor', code: RoleCode.EXO_ADVISOR},
  {name: 'ExO Coach', code: RoleCode.EXO_COACH},
  {name: 'ExO Head Coach', code: RoleCode.EXO_HEAD_COACH},
  {name: 'ExO Disruptor', code: RoleCode.EXO_DISRUPTOR},
  {name: 'ExO Consultant', code: RoleCode.EXO_CONSULTANT},
  {name: 'ExO Trainer', code: RoleCode.EXO_TRAINER}
];
