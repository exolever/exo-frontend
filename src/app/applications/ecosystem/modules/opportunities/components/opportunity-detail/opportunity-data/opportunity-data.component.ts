import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { OpportunityModel } from '@applications/ecosystem/modules/opportunities/models/opportunity.model';
import { LanguageEnum } from '@core/enums';

import { BreakPointService } from '@applications/break-point/break-point.service';
import {
  ApplicantDetailDialogComponent
} from '@opportunities/shared/components/applicant-detail-dialog/applicant-detail-dialog.component';
import {
  OpportunityApplicantModel
} from '@applications/ecosystem/modules/opportunities/models/opportunity-applicant.model';

import { OpportunityDataService } from './opportunity-data.service';

@Component({
  selector: 'app-data-opportunity',
  templateUrl: './opportunity-data.component.html',
  styleUrls: ['./opportunity-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityDataComponent implements OnDestroy {
  @Input() opportunity: OpportunityModel;
  @Input() isPreview = false;
  private subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private opportunityDataService: OpportunityDataService,
    private breakPointService: BreakPointService
  ) { }

  showAppliedLabel(): boolean {
    return this.opportunity.isApplicantRequested();
  }

  showRecipients(): boolean {
    return this.isPreview && this.opportunity.isTargetFixed();
  }

  showForYouLabel(): boolean {
    return !this.isPreview && this.opportunity.isTargetFixed();
  }

  showSelectedLabel(): boolean {
    return this.opportunity.hasBeenSelected();
  }

  showNotSelectedLabel(): boolean {
    return this.opportunity.hasBeenRejected();
  }

  showLabel(): boolean {
    return this.showAppliedLabel()
      || this.showSelectedLabel()
      || this.showNotSelectedLabel()
      || this.showForYouLabel()
      || this.opportunity.isClosed();
  }

  showAdvisorCallGuidelines(): boolean {
    return this.opportunity.isAdvisorCall();
  }

  getAdvisorCallGuidelinesMessage(): string {
    return `${this.translate.instant('ECOSYSTEM.OPPORTUNITIES.ADVISOR_CALL_GUIDELINES.APPLICANT')}
      <a target='_blank' href='${this.getGuidelinesUrl(LanguageEnum.ENGLISH)}'>
        [${this.translate.instant('ECOSYSTEM.OPPORTUNITIES.ADVISOR_CALL_GUIDELINES.LANGUAGES.ENGLISH').toUpperCase()}]
      </a>
      <a target='_blank' href='${this.getGuidelinesUrl(LanguageEnum.SPANISH)}'>
        [${this.translate.instant('ECOSYSTEM.OPPORTUNITIES.ADVISOR_CALL_GUIDELINES.LANGUAGES.SPANISH').toUpperCase()}]
      </a>`;
  }

  private getGuidelinesUrl(lang: LanguageEnum) {
    return this.isPreview
      ? this.opportunityDataService.getAdvisorCallRequesterGuidelinesUrl(lang)
      : this.opportunityDataService.getAdvisorCallApplicantGuidelinesUrl(lang);
  }

  openDetails(applicant: OpportunityApplicantModel): void {
    this.subscription.add(
      this.breakPointService.fsSmDialogLg(ApplicantDetailDialogComponent, {
        data: {
          applicant,
          opportunity: this.opportunity
        },
        showChat: false,
        title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.TITLE'),
      }).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getClosedMessage(): string {
    if (this.opportunity.hasBeenSelected()) {
      return this.translate.instant('ECOSYSTEM.OPPORTUNITIES.CLOSED_MESSAGES.SELECTED');
    } else if (this.opportunity.hasBeenRejected()) {
      return this.translate.instant('ECOSYSTEM.OPPORTUNITIES.CLOSED_MESSAGES.REJECTED');
    }
    return this.translate.instant('ECOSYSTEM.OPPORTUNITIES.CLOSED_MESSAGES.OTHER');
  }

  showId(): boolean {
    const applicant = this.opportunity.myApplicant;
    return applicant && (applicant.isSelected()
      || applicant.isFeedbackInvolved()
      || applicant.isCompleted());
  }
}
