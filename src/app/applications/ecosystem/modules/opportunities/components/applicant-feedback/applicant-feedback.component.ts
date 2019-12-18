import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as MomentTZ from 'moment-timezone';

import { OverlayService } from '@overlay/services/overlay.service';

import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as fromOpportunities from '@opportunities/store/reducers';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import { Feedback, OpportunitiesFeedbackService } from '@opportunities/shared/services/opportunities-feedback.service';
import { Subscription } from 'rxjs';
import {
  OpportunityFeedbackDialogComponent
} from '@opportunities/shared/components/feedback/opportunity-feedback-dialog/opportunity-feedback-dialog.component';
import { OpportunityDurationUnit } from '../../models/opportunity.enum';
import { switchMap } from 'rxjs/operators';
import { SowInterface } from '../../models/opportunity.interface';
import { SowService } from '../../shared/services/management-sow.service';

@Component({
  selector: 'app-applicant-feedback',
  templateUrl: './applicant-feedback.component.html',
  styleUrls: ['./applicant-feedback.component.scss']
})
export class ApplicantFeedbackComponent implements OnInit, OnDestroy {
  opportunity: OpportunityModel;
  feedbacks: Feedback[];
  subscriptions = new Subscription();
  message: string;

  constructor(
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private translate: TranslateService,
    private store: Store<AppState>,
    private feedbackService: OpportunitiesFeedbackService,
    private sowService: SowService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.store.pipe(
        select(state => fromOpportunities.selectOpportunity(state.opportunities.opportunities, params.pk)),
        switchMap((opportunity: OpportunityModel) => {
          this.opportunity = opportunity;
          this.feedbacks = this.feedbackService.serializeApplicant([opportunity.myApplicant], opportunity);
          return this.sowService.getDataSow(opportunity.myApplicant.pk);
        })
      ).subscribe((sowData: SowInterface) => {
        const endDate = this.getEndDate(sowData);
        this.message = this.translate.instant(
          'ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_APPLICANT.TITLE',
          {date: endDate.format('llll')
        });
        this.message = this.message.concat(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_APPLICANT.HEADING'));
        this.message = this.message.concat(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_APPLICANT.REASON1'));
        this.message = this.message.concat(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_APPLICANT.REASON2'));
        this.message = this.message.concat(
          this.translate.instant(
            'ECOSYSTEM.OPPORTUNITIES.FEEDBACK.ALERT_APPLICANT.REASON3',
            {date: endDate.add(7, 'd').format('llll')
          })
        );
      });
    });
  }

  getEndDate(sowData: SowInterface): MomentTZ.Moment {
    const tmp = sowData.startDate.clone();
    switch (sowData.durationUnit) {
      case OpportunityDurationUnit.MINUTE:
        tmp.add(sowData.duration, 'm');
        break;
      case OpportunityDurationUnit.HOUR:
        tmp.add(sowData.duration, 'h');
        break;
      case OpportunityDurationUnit.DAY:
        tmp.add(sowData.duration, 'd');
        break;
      case OpportunityDurationUnit.WEEK:
        tmp.add(sowData.duration, 'w');
        break;
      case OpportunityDurationUnit.MONTH:
        tmp.add(sowData.duration, 'M');
        break;
    }
    return tmp;
  }

  hasFeedbacks(): boolean {
    return ! this.feedbacks.some(fb =>
      fb.statusApplicant || fb.statusRequester || fb.statusCompleted || (fb.statusReady && fb.createdBy));
  }

  feedbackDialog(feedback) {
    this.overlayService.open(<Component>OpportunityFeedbackDialogComponent,
      {
        data: {
          title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FEEDBACK.TITLE'),
          showStatus: false,
          feedback,
        }
      });
    this.overlayService.afterClosed.subscribe((res) => {
      if (res) {
        this.feedbacks = this.feedbackService.serializeApplicant([res.myApplicant]);
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
