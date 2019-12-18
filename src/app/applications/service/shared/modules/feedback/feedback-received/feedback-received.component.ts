import {Component, Input} from '@angular/core';
import {Feelings, ReceivedFeedback} from '@applications/service/shared/models/received-feedback.model';
import {FeedbackReceivedFeelingsComponent} from './feedback-received-feelings/feedback-received-feelings.component';
import {FeedbackReceivedCommentsComponent} from './feedback-received-comments/feedback-received-comments.component';
import {FeedbackReceivedRatesComponent} from './feedback-received-rates/feedback-received-rates.component';
import {MatDialog} from '@angular/material';
import { Team } from '@applications/workspace/projects/models/team.model';
import { TeamModel } from '@applications/service/old-project/models/team.model';
import {TranslateService} from '@ngx-translate/core';
import {FeedbackService} from '@applications/service/shared/modules/feedback/feedback.service';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

@Component({
  selector: 'app-feedback-received',
  templateUrl: './feedback-received.component.html',
  styleUrls: ['./feedback-received.component.scss']
})
export class FeedbackReceivedComponent {
  @Input() feedback: ReceivedFeedback;
  @Input() team: Team | TeamModel;
  @Input() role: SprintRoleEnum;
  maxGrade = 5;
  feelings = Feelings;
  children = {
    comments: FeedbackReceivedCommentsComponent,
    rates: FeedbackReceivedRatesComponent,
    feelings: FeedbackReceivedFeelingsComponent
  };

  constructor(private dialog: MatDialog,
              public translate: TranslateService,
              private service: FeedbackService) {
  }

  openDialog($event) {
    this.dialog.open(this.children[$event], {
      disableClose: false,
      autoFocus: false,
      data: {
        feedback: this.feedback,
        team: this.team,
        role: this.role
      }
    });
  }

  getTitle() {
    return this.service.getTitle(this.role, this.feedback, this.team.name);
  }

  getSubtitle() {
    return this.service.getSubtitle(this.role, this.feedback);
  }
}
