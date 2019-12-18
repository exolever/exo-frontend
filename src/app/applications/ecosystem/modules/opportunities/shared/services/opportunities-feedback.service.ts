import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { take } from 'rxjs/operators';

import { ApiResources, UrlService, UserModel, UserService } from '@app/core';
import { getEnumValue } from '@shared/helpers/enum.helper';
import { OpportunityApplicantModel } from '@opportunities/models/opportunity-applicant.model';
import { OpportunityModel } from '@opportunities/models/opportunity.model';

import { OpportunityApplicantStatusEnum, ApplicantActionsEnum } from '../../models/opportunity.enum';

export enum FeedbackStatus {
  Successful = 'D',
  Uncompleted = 'N',
}

export interface Feedback {
  idApplicant: number;
  userActions: string[];
  userApplicant: any;
  collaboration: number;
  applicantStatus: string;
  comment?: string;
  communication?: number;
  createdBy?: any;
  explained?: number;
  recommendation?: number;
  status?: string;
  statusCompleted?: boolean;
  statusApplicant?: boolean;
  statusRequester?: boolean;
  statusReady?: boolean;
}

export enum FeedbackActions {
  CH_APPLICANT_COMPLETED = 'A', // Pueden dar feedback. Todavia ninguno.
  CH_APPLICANT_FEEDBACK_REQUESTER = 'C', // Requester give feedback.
  CH_APPLICANT_FEEDBACK_APP = 'E', // Applicant give feedback.
  CH_APPLICANT_FEEDBACK_READY = 'H', // Los dos han dado Feedback o ha finalizado el mes.
}

@Injectable({
  providedIn: 'root'
})
export class OpportunitiesFeedbackService {

  userLogged: UserModel;

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private userService: UserService
  ) {
    this.userService.user$.pipe(
      take(1)
    ).subscribe(user => this.userLogged = user);
  }

  static feedbackStatusCompleted(status: string) {
    return status === FeedbackActions.CH_APPLICANT_COMPLETED;
  }

  static feedbackStatusApplicant(status: string) {
    return status === FeedbackActions.CH_APPLICANT_FEEDBACK_APP;
  }

  static feedbackStatusRequester(status: string) {
    return status === FeedbackActions.CH_APPLICANT_FEEDBACK_REQUESTER;
  }

  static feedbackStatusReady(status: string) {
    return status === FeedbackActions.CH_APPLICANT_FEEDBACK_READY;
  }

  serializeApplicant(applicants: any, opportunity?: OpportunityModel) {
    return applicants.map(applicant => {
      return this.serializeFeedback(applicant, opportunity);
    });
  }

  serializeFeedback(applicant: OpportunityApplicantModel, opportunity?: OpportunityModel): Feedback[] | {} {
    let summary = {};
    const appStatus = getEnumValue(OpportunityApplicantStatusEnum, applicant.status);

    const serializeFeedback = {
      idApplicant: applicant.pk,
      applicantStatus: appStatus,
      userApplicant: applicant.user,
      userActions: applicant.userActions.length > 0 ?
        applicant.userActions.map(action => getEnumValue(ApplicantActionsEnum, action)) : applicant.userActions,
      statusCompleted: OpportunitiesFeedbackService.feedbackStatusCompleted(appStatus),
      statusApplicant: OpportunitiesFeedbackService.feedbackStatusApplicant(appStatus),
      statusRequester: OpportunitiesFeedbackService.feedbackStatusRequester(appStatus),
      statusReady: OpportunitiesFeedbackService.feedbackStatusReady(appStatus),
    };

    summary = { ...serializeFeedback };

    if (applicant.feedbacks.length > 0) {
      applicant.feedbacks.map(feedback => {
        if (feedback.createdBy.uuid !== this.userLogged.uuid) {
          summary = {...feedback, ...summary};
        } else {
          return;
        }
      });
    }

    if (serializeFeedback.statusApplicant && opportunity) {
      summary['userApplicant'] = opportunity.requestedBy.user;
    }

    return summary;
  }

  submitFeedback(data: { explained: number, collaboration: number, communication: number,
    comment: string, recommendation: number }, applicantPk: number) {
      const url = this.urlService.resolve(ApiResources.FEEDBACK_APPLICANT, applicantPk);
      return this.http.post(url, data);
  }

}
