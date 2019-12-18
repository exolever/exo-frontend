import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {Feedback, ReceivedFeedback} from '@applications/service/shared/models/received-feedback.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TeamModel} from '@service/old-project/models/team.model';
import {Team as TeamGProject} from '@applications/workspace/projects/models/team.model';
import {FeedbackService} from '@applications/service/shared/modules/feedback/feedback.service';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

@Component({
  selector: 'app-feedback-received-comments',
  templateUrl: './feedback-received-comments.component.html',
  styleUrls: ['./feedback-received-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackReceivedCommentsComponent implements OnInit {
  sortedComments: Feedback[];
  feedback: ReceivedFeedback;
  team: TeamModel | TeamGProject;
  role: SprintRoleEnum;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<any>,
              private service: FeedbackService) {
  }

  ngOnInit(): void {
    this.feedback = this.data.feedback;
    this.role = this.data.role;
    this.team = this.data.team;
    this.sortedComments = this.feedback.results
      .filter(res => !!res.comment)
      .sort((a, b) => (a.comment.date < b.comment.date) ? 1 : -1);
  }

  getTitle() {
    return this.service.getTitle(this.role, this.feedback, this.team.name);
  }

  onClose() {
    this.dialogRef.close();
  }
}
