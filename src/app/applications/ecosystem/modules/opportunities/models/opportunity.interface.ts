import * as MomentTZ from 'moment-timezone';

import { AllCurrenciesEnum, OpportunityMode, OpportunityDurationUnit } from './opportunity.enum';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';

export class QuestionInterface {
  id: number;
  title: string;
}

export class AnswerInterface {
  question: QuestionInterface;
  responseText: string;
}

export interface BudgetInterface {
  budget: number|string;
  currency: AllCurrenciesEnum;
}

export class SowInterface {
  title: string;
  description: string;
  mode: OpportunityMode;
  location: string;
  placeId: string;
  locationUrl: string;
  startDate: MomentTZ.Moment;
  endDate: MomentTZ.Moment;
  startTime: MomentTZ.Moment;
  timeZone: string;
  entity: string;
  infoDetail: string;
  budgets: BudgetInterface[] = [];
  duration: number;
  durationUnit: OpportunityDurationUnit;
  files: Array<FilestackUploadInterface> = [];

  constructor(data: any) {
    Object.assign(this, data);
  }
}
