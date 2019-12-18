import {Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

import {UserModel} from '@core/models/user/user.model';
import { Feedback, FeedbackType } from '@applications/service/shared/models/feedback.model';
import {ReceivedFeedback} from '@applications/service/shared/models/received-feedback.model';
import { Team } from '@applications/workspace/projects/models/team.model';
import { TeamModel } from '@applications/service/old-project/models/team.model';
import { Step } from '@service/old-project/models/step.model';
import { StepModel as StepGProject } from '@applications/workspace/projects/models/step.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

@Component({
  selector: 'app-assignment-reflect',
  templateUrl: './assignment-reflect.component.html',
  styleUrls: ['./assignment-reflect.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AssignmentReflectComponent {
  @Input() quizDone: boolean;
  @Input() step: Step | StepGProject;
  @Input() team: Team | TeamModel;
  @Input() user: UserModel;
  @Input() feedback: Feedback;
  @Input() receivedFeedback: ReceivedFeedback[];
  @Input() role: string | SprintRoleEnum;
  @Input() showFeedback = true;
  @Input() showQuiz = true;
  @Output() openQuiz = new EventEmitter<Step | StepGProject>();
  @Output() fillSurvey = new EventEmitter<string>();
  @Output() sendFeedback = new EventEmitter<Feedback>();

  onOpenQuiz(step: Step | StepGProject) {
    this.openQuiz.next(step);
    return false;
  }

  forTeamMember(feedback?: Feedback): boolean {
    return feedback ? feedback.target === FeedbackType.Coach : false;
  }

  onSendFeedback(feedback: Feedback) {
    this.sendFeedback.emit(feedback);
  }

  onFillSurvey(url: string) {
    this.fillSurvey.emit(url);
  }
}
