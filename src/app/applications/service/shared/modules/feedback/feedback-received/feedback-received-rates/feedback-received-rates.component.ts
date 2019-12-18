import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FeedbackFrom, Feelings, ReceivedFeedback} from '@applications/service/shared/models/received-feedback.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Step} from '@service/old-project/models/step.model';
import {TeamModel} from '@service/old-project/models/team.model';
import {StepModel as StepGProject} from '@applications/workspace/projects/models/step.model';
import {Team as TeamGProject} from '@applications/workspace/projects/models/team.model';
import {NavigationService} from '@shared/navigation/navigation.service';
import {TranslateService} from '@ngx-translate/core';
import {FeedbackService} from '@applications/service/shared/modules/feedback/feedback.service';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';


@Component({
  selector: 'app-feedback-received-rates',
  templateUrl: './feedback-received-rates.component.html',
  styleUrls: ['./feedback-received-rates.component.scss'],
  providers: [NavigationService],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class FeedbackReceivedRatesComponent implements OnInit {
  feelings = Feelings;
  maxGrade = 5;
  feedback: ReceivedFeedback;
  step: Step | StepGProject;
  team: TeamModel | TeamGProject;
  role: SprintRoleEnum;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private navigationService: NavigationService,
              private dialogRef: MatDialogRef<any>,
              public translate: TranslateService,
              private service: FeedbackService) {
  }

  ngOnInit(): void {
    this.feedback = this.data.feedback;
    this.role = this.data.role;
    this.team = this.data.team;
  }

  navigateToProfile(slug): void {
    this.navigationService.goToProfile(slug, 'SERVICE.ASSIGNMENTS.REFLECT', true);
    this.dialogRef.close();
  }

  getTitle() {
    return this.service.getTitle(this.role, this.feedback, this.team.name);
  }

  getSubtitle() {
    return this.service.getRatesSubtitle(this.role, this.feedback);
  }

  fromParticipants(origin: number) {
    return FeedbackFrom.Team === origin;
  }

  onClose() {
    this.dialogRef.close();
  }

  showLink() {
    return (SprintRoleEnum.HEAD_COACH_SPRINT === this.role || SprintRoleEnum.DELIVERY_MANAGER_SPRINT === this.role)
      && this.fromParticipants(this.feedback.origin);
  }
}
