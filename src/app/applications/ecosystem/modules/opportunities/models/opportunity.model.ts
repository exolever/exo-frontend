import * as MomentTZ from 'moment-timezone';

import { KeywordModel, LanguageModel } from '@applications/shared/models';
import { getEnumValue } from '@shared/helpers/enum.helper';
import {
  OpportunityActionEnum, AllCurrenciesEnum, OpportunityMode, OpportunityStatusEnum, OpportunityTarget,
  OpportunityDurationUnit, OpportunityUserStatusEnum
} from '@ecosystem/modules/opportunities/models/opportunity.enum';
import { CertificationModel } from '@core/modules/certifications/models';
import { RoleCategoryModel, RoleModel } from '@core/modules/roles/models';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { AdvisorCallRoleEnum, RoleCategoryEnum, SprintRoleEnum, OtherRoleEnum } from '@core/modules/roles/enums';

import { BudgetInterface, QuestionInterface } from './opportunity.interface';
import { OpportunityApplicantModel } from './opportunity-applicant.model';
import { OpportunityRecipientModel } from './opportunity-recipient.model';
import { UserActionModel } from './user-action.model';


export class OpportunityModel {
  actions: Array<OpportunityActionEnum> = [];
  alreadyVisited: boolean;
  applicants: OpportunityApplicantModel[] = [];
  myApplicant?: OpportunityApplicantModel;
  budgets?: BudgetInterface[] = [];
  client: string;
  created: MomentTZ.Moment;
  description: string;
  startDate: MomentTZ.Moment;
  deadlineDate: MomentTZ.Moment;
  duration: number;
  durationUnit: OpportunityDurationUnit;
  entity: string;
  infoDetail: string;
  isNew: boolean;
  keywords: KeywordModel[];
  mode: OpportunityMode;
  location?: string;
  placeId?: string;
  locationUrl?: string;
  modified: MomentTZ.Moment;
  hasBeenEdited: boolean;
  newApplicants: number;
  numApplicants: number;
  numPositions: number;
  pk: number;
  project: any;
  questions: QuestionInterface[] = [];
  requestedBy: UserActionModel;
  roleCode: string;
  route: string;
  status: OpportunityStatusEnum;
  slug: string;
  subject: string;
  target: OpportunityTarget = OpportunityTarget.OPEN;
  recipients: OpportunityRecipientModel[];
  userStatus: OpportunityUserStatusEnum;
  uuid: string;
  numMessages: { total: number, unread: number };
  certificationRequired: CertificationModel;
  exoRole: RoleModel;
  exoCategory: RoleCategoryModel;
  files: Array<FilestackUploadInterface> = [];
  customRole: string;
  customCategory: string;
  mainLanguage: LanguageModel;
  secondaryLanguage: LanguageModel;

  constructor(data: any) {
    Object.assign(this, data);
  }

  isApplicantRequested(): boolean {
    return this.userStatus === OpportunityUserStatusEnum.B;
  }

  isTargetFixed(): boolean {
    return this.target === OpportunityTarget.TARGETED;
  }

  getCategoryName(): string {
    return this.exoCategory.code === RoleCategoryEnum.OTHER ? this.customCategory : this.exoCategory.name;
  }

  getRoleName(): string {
    return [SprintRoleEnum.OTHER_SPRINT,
      OtherRoleEnum.OTHER_OTHER].includes(<any>this.exoRole.code) ? this.customRole : this.exoRole.name;
  }

  isTargetOpen(): boolean {
    return this.target === OpportunityTarget.OPEN;
  }

  // Make sense from the Advisor point of view
  isApplicantRejected(): boolean {
    return this.userStatus === OpportunityUserStatusEnum.J;
  }

  // Make sense from the Advisor point of view
  isApplicantAccepted(): boolean {
    return this.userStatus === OpportunityUserStatusEnum.G;
  }

  isCompleted(): boolean {
    return this.userStatus === OpportunityUserStatusEnum.C;
  }

  isVerified(): boolean {
    return this.userStatus === OpportunityUserStatusEnum.H;
  }

  isClosed(): boolean {
    return this.status === OpportunityStatusEnum.L;
  }

  /*
    If team has verified the opportunity, the userStatus is Verified instead of Advisor confirmed, never mind
    if the advisor has sent the evaluation. The userStatus === Advisor confirmed only when the advisor
    has sent his evaluation and the team has not said anything.
   */
  isAdvisorEvaluationDone(): boolean {
    return this.userStatus === OpportunityUserStatusEnum.A;
  }

  availablePositions(): number {
    return this.numPositions - this.applicants.filter(app => app.isSelected()).length;
  }

  hasAvailablePositions(): boolean {
    return this.availablePositions.length > 0;
  }

  canEdit(): boolean {
    return this.actions.includes(OpportunityActionEnum.E);
  }

  canRemove(): boolean {
    return this.actions.includes(OpportunityActionEnum.R);
  }

  canClose(): boolean {
    return this.actions.includes(OpportunityActionEnum.C);
  }

  canReopen(): boolean {
    return this.actions.includes(OpportunityActionEnum.G);
  }

  /**
   * We need to maintenance old values for budgets where weren't a number
   */
  humanizedBudgets(): string[] {
    return this.budgets.map(b => {
      const value = !Number.isNaN(+b.budget) ? +b.budget : b.budget;
      return `${value} ${getEnumValue(AllCurrenciesEnum, b.currency)}`;
    });
  }

  getBudgeInCurrency(currency: AllCurrenciesEnum) {
    return this.budgets
      .filter(budget => budget.currency === currency)
      .map((obj: BudgetInterface) => obj.budget)
      .reduce((prev, next) => +prev + +next);
  }

  hasApplicationFeedback() {
    return this.myApplicant &&
      (this.myApplicant.isFeedbackInvolved() || this.myApplicant.isCompleted() || this.myApplicant.isSelected());
  }

  hasBeenSelected(): boolean {
    return this.isApplicantAccepted()
      || this.isCompleted()
      || this.isAdvisorEvaluationDone()
      || this.isVerified();
  }

  hasBeenRejected(): boolean {
    return this.isApplicantRejected();
  }

  isAdvisorCall(): boolean {
    return this.exoRole.code === AdvisorCallRoleEnum.ADVISOR_CALL;
  }
}
