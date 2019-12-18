import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import * as fromOpportunities from '@ecosystem/modules/opportunities/store/reducers';
import { Subscription } from 'rxjs';
import { Feedback, OpportunitiesFeedbackService } from '@opportunities/shared/services/opportunities-feedback.service';
import {
  OpportunityFeedbackDialogComponent
} from '@opportunities/shared/components/feedback/opportunity-feedback-dialog/opportunity-feedback-dialog.component';
import { OverlayService } from '@overlay/services/overlay.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-opportunity-feedback',
  templateUrl: './opportunity-feedback.component.html',
  styleUrls: ['./opportunity-feedback.component.scss'],
})
export class OpportunityFeedbackComponent implements OnInit {

  opportunity: OpportunityModel;
  feedbacks: Feedback[];
  subscriptions = new Subscription();
  message: string;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private feedbackService: OpportunitiesFeedbackService,
    private overlayService: OverlayService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.store.pipe(select(
        state => fromOpportunities.selectOpportunityAdmin(state.opportunities.opportunitiesAdmin, params.pk)
      )).subscribe((opportunity: OpportunityModel) => {
        this.opportunity = opportunity;
        this.feedbacks = this.feedbackService.serializeApplicant(opportunity.applicants);
        this.message = this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_ADMIN.TITLE');
        this.message = this.message.concat(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_ADMIN.HEADING'));
        this.message = this.message.concat(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_ADMIN.REASON1'));
        this.message = this.message.concat(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_ADMIN.REASON2'));
        this.message = this.message.concat(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_ADMIN.REASON3'));
      });
    });
  }

  hasFeedbacks(): boolean {
    return ! this.feedbacks.some(fb =>
      fb.statusApplicant || fb.statusRequester || fb.statusCompleted || fb.statusReady);
  }

  feedbackDialog(feedback) {
    this.overlayService.open(<Component>OpportunityFeedbackDialogComponent,
      {
        data: {
          title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.TITLE'),
          showStatus: true,
          feedback,
        }
      });
    this.overlayService.afterClosed.subscribe((res) => {
      if (res) {
        this.feedbacks = this.feedbackService.serializeApplicant(res.applicants);
      }
    });
  }

}
