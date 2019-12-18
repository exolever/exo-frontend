export enum CohortLevelEnum {
  LEVEL2 = 'L2',
  LEVEL3 = 'L3',
  LEVELFT = 'L2A'
}

export interface CountryInterface {
  name: string;
  code: string;
}

export interface CohortInterface {
  pk: number;
  label: string;
  programLabel: string;
  coupon: string;
  discount: number;
  price: number;
  payNow: number;
  currency: string;
}

export interface Contact {
  pk?: number;
  fullName: string;
  mail: string;
  level: CohortLevelEnum;
  coupon?: string;
  cohort?: number;
  billingName?: string;
  billingAddress?: string;
  country?: string;
  taxId?: string;
  recaptcha?: string;
  paymentMethod: string;
  applicationDetails?: {
    reasons?: string;
    whereMetUs?: string;
  };
}
