import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UserModel } from '@core/models/user/user.model';
import { messageHintErrorAnimation } from '@animations/message-hint-error.animation';
import { Feedback, FeedbackType } from '@applications/service/shared/models/feedback.model';
import { Feelings, ReceivedFeedback } from '@applications/service/shared/models/received-feedback.model';
import { ApiResources, UrlService } from '@app/core';
import { FeedbackService } from '@applications/service/shared/modules/feedback/feedback.service';
import { Team } from '@applications/workspace/projects/models/team.model';
import { TeamModel } from '@applications/service/old-project/models/team.model';
import { environment } from '@environments/environment';
import { Step } from '@service/old-project/models/step.model';
import { StepModel as StepGProject } from '@applications/workspace/projects/models/step.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  animations: [messageHintErrorAnimation]
})
export class FeedbackComponent implements OnInit {
  @Input() user: UserModel;
  @Input() feedback: Feedback;
  @Input() step: Step | StepGProject;
  @Input() team: Team | TeamModel;
  @Input() receivedFeedback: ReceivedFeedback[] = [];
  @Input() role: SprintRoleEnum;
  @Output() fillSurvey = new EventEmitter<string>();
  @Output() sendFeedback = new EventEmitter<Feedback>();
  public feelings = Feelings;
  form: FormGroup;
  feedbackError = false;
  maxGrade = 5;
  public type = FeedbackType;
  public roles: SprintRoleEnum;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private urlService: UrlService,
    private service: FeedbackService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      comment: [''],
      coordinatorRating: ['', Validators.required],
      feelingsRating: [undefined, Validators.required]
    });
  }

  sendRating() {
    if (!this.form.valid) {
      this.feedbackError = true;
    } else {
      const feedbackFeelings = <Feedback>{
        target: this.feedback.target,
        rate: this.form.get('coordinatorRating').value,
        feedback: this.form.get('feelingsRating').value,
        comments: this.form.get('comment').value
      };
      this.sendFeedback.emit(feedbackFeelings);
    }
  }

  forTeamMember(): boolean {
    return this.feedback.target === FeedbackType.Coach;
  }

  hasFeedback(feeds: ReceivedFeedback[]) {
    return feeds ? feeds.filter(f => f.results.length).length : false;
  }

  onDownloadReport() {
    const newWindow = window.open('', '_blank');
    this.route.params.subscribe((p) =>
      newWindow.location.href = this.urlService.resolveAPI(
        ApiResources.SERVICE_DOWNLOAD_REPORT, p.pkService, p.pkTeam, p.pk)
    );
  }

  getParagraph() {
    return this.service.getParagraph(this.role);
  }

  canSeeResults() {
    return SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT === this.role ||
      SprintRoleEnum.SPRINT_COACH_SPRINT === this.role;
  }

  isParticipant() {
    return SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT === this.role;
  }

  openSurvey(): boolean {
    const enum typeformFields {
      PROJECT_NAME = 'project_name',
      USER_EMAIL = 'user_email',
      USER_NAME = 'user_name'
    }

    const url = this.urlService.resolveGetParams(
      this.forTeamMember() ? environment.TF_FEEDBACK_FOR_PARTICIPANT_SPRINT : environment.TF_FEEDBACK_FOR_COACH_SPRINT,
      [typeformFields.PROJECT_NAME, typeformFields.USER_EMAIL, typeformFields.USER_NAME],
      [this.route.snapshot.data.project.name, this.user.email, this.user.fullName]
    );
    this.fillSurvey.emit(url);
    return false;
  }
}
