import * as MomentTZ from 'moment-timezone';

import { UserModel } from '@core/models/user/user.model';
import { getValueEnum } from '@shared/helpers/enum.helper';
import {
  OpportunityActionEnum, OpportunityApplicantStatusEnum
} from '@ecosystem/modules/opportunities/models/opportunity.enum';
import { AnswerInterface, SowInterface } from './opportunity.interface';
import { Feedback } from '@opportunities/shared/services/opportunities-feedback.service';

export class OpportunityApplicantModel {
  pk: number;
  answers: AnswerInterface[];
  summary: string;
  opportunityPk: number;
  user: UserModel;
  status: OpportunityApplicantStatusEnum;
  actions: Array<OpportunityActionEnum> = [];
  questionsExtraInfo?: string;
  declinedMessage?: string;
  created?: MomentTZ.Moment;
  sow?: SowInterface;
  conversation?: number;
  feedbacks: Feedback[];
  userActions: any[];

  constructor(data?: any) {
    if (data) {
      Object.assign(this, data);
      this.status = getValueEnum(OpportunityApplicantStatusEnum, data.status);
      this.pk = data.id ? data.id : undefined;
      this.created = MomentTZ(data.created);
    }
  }

  isSelected(): boolean {
    return this.status === OpportunityApplicantStatusEnum.G;
  }

  isFeedbackInvolved(): boolean {
    return this.status === OpportunityApplicantStatusEnum.E
      || this.status === OpportunityApplicantStatusEnum.C
      || this.status === OpportunityApplicantStatusEnum.H;
  }

  isCompleted(): boolean {
    return this.status === OpportunityApplicantStatusEnum.A;
  }

  isRequested(): boolean {
    return this.status === OpportunityApplicantStatusEnum.B;
  }

  isRejected(): boolean {
    return this.status === OpportunityApplicantStatusEnum.J;
  }

  canBeSelected(): boolean {
    return this.actions.includes(OpportunityActionEnum.T);
  }

  canBeRejected(): boolean {
    return this.actions.includes(OpportunityActionEnum.D);
  }

  canEditAssociatedSow(): boolean {
    return this.actions.includes(OpportunityActionEnum.H);
  }

  haveAvailableActions(): boolean {
    return this.actions.length > 0;
  }

}
