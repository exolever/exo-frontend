import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Feelings, ReceivedFeedback} from '@applications/service/shared/models/received-feedback.model';
import {FeedbackService} from '@applications/service/shared/modules/feedback/feedback.service';
import {TeamModel} from '@service/old-project/models/team.model';
import {Team as TeamGProject} from '@applications/workspace/projects/models/team.model';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

@Component({
  selector: 'app-feedback-received-feelings',
  templateUrl: './feedback-received-feelings.component.html',
  styleUrls: ['./feedback-received-feelings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class FeedbackReceivedFeelingsComponent implements OnInit {
  feelings = Feelings;
  feedback: ReceivedFeedback;
  role: SprintRoleEnum;
  team: TeamModel | TeamGProject;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<any>,
              private service: FeedbackService) {
  }

  ngOnInit(): void {
    this.feedback = this.data.feedback;
    this.role = this.data.role;
    this.team = this.data.team;

  }

  getTitle() {
    return this.service.getTitle(this.role, this.feedback, this.team.name);
  }

  onClose() {
    this.dialogRef.close();
  }
}
