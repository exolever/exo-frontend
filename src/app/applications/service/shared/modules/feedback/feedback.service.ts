import { Injectable } from '@angular/core';
import { FeedbackFrom, ReceivedFeedback } from '@applications/service/shared/models/received-feedback.model';
import { TranslateService } from '@ngx-translate/core';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(public translate: TranslateService) {
  }

  fromParticipants(origin: number) {
    return FeedbackFrom.Team === origin;
  }

  getTitle(role: SprintRoleEnum, feedback: ReceivedFeedback, teamName: string): string {
    let title;
    if (SprintRoleEnum.SPRINT_COACH_SPRINT === role) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.HEADER_TEAM_NAME') + ` ${teamName}`;
    }
    if ((SprintRoleEnum.HEAD_COACH_SPRINT === role ||
      SprintRoleEnum.DELIVERY_MANAGER_SPRINT === role) && this.fromParticipants(feedback.origin)) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.HEADER_PARTICIPANTS');
    }
    if ((SprintRoleEnum.HEAD_COACH_SPRINT === role ||
      SprintRoleEnum.DELIVERY_MANAGER_SPRINT === role) && !this.fromParticipants(feedback.origin)) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.HEADER_COACH');
    }
    return title + ` ${feedback.results.length}/${feedback.totalReviewers}`;
  }

  getSubtitle(role: SprintRoleEnum, feedback: ReceivedFeedback): string {
    let title;
    if (SprintRoleEnum.SPRINT_COACH_SPRINT === role) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.COACH_RATE');
    }
    if (
      (SprintRoleEnum.HEAD_COACH_SPRINT === role ||
        SprintRoleEnum.DELIVERY_MANAGER_SPRINT === role) &&
        this.fromParticipants(feedback.origin)
      ) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.HEAD_COACH_RATE_FROM_TEAM');
    }
    if ((SprintRoleEnum.HEAD_COACH_SPRINT === role) && !this.fromParticipants(feedback.origin)) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.HEAD_COACH_RATE_FROM_COACH');
    }
    if ((SprintRoleEnum.DELIVERY_MANAGER_SPRINT === role)
      && !this.fromParticipants(feedback.origin)) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.DELIVERY_RATE');
    }
    return title;
  }

  getParagraph(role: SprintRoleEnum): string {
    let paragraph;
    if (SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT === role) {
      paragraph = this.translate.instant('SERVICE.REFLECT.PERSONAL_FEEDBACK.PARAGRAPH_PARTICIPANT');
    }
    if (SprintRoleEnum.SPRINT_COACH_SPRINT === role) {
      paragraph = this.translate.instant('SERVICE.REFLECT.PERSONAL_FEEDBACK.PARAGRAPH_COACH');
    }
    if (SprintRoleEnum.HEAD_COACH_SPRINT === role || SprintRoleEnum.DELIVERY_MANAGER_SPRINT === role) {
      paragraph = this.translate.instant('SERVICE.REFLECT.PERSONAL_FEEDBACK.PARAGRAPH_HEAD_COACH');
    }
    return paragraph;
  }

  getRatesSubtitle(role: SprintRoleEnum, feedback: ReceivedFeedback): string {
    let title;
    if (SprintRoleEnum.SPRINT_COACH_SPRINT === role) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.COACH_RATE');
    }
    if (SprintRoleEnum.HEAD_COACH_SPRINT === role && !this.fromParticipants(feedback.origin)) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.HEAD_COACH_RATE_FROM_COACH');
    }
    if (SprintRoleEnum.DELIVERY_MANAGER_SPRINT === role && !this.fromParticipants(feedback.origin)) {
      title = this.translate.instant('SERVICE.REFLECT.RECEIVED_FEEDBACK.DELIVERY_RATE');
    }
    return title;
  }
}
