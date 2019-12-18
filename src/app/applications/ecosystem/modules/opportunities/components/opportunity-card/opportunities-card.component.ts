import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import * as MomentTZ from 'moment-timezone';
import { Subscription } from 'rxjs';

import { Urls, UrlService, UserModel } from '@app/core';
import { OpportunityModel } from '../../models/opportunity.model';
import { OpportunityMode, OpportunityStatusEnum } from '@opportunities/models/opportunity.enum';

@Component({
  selector: 'app-opportunities-card',
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunitiesCardComponent implements OnDestroy {
  @Input() title: string;
  @Input() opportunity: OpportunityModel;
  @Input() user: UserModel;
  @Input() isDiscarded = false;
  mode = OpportunityMode;
  private subscription = new Subscription();

  constructor(
    private urlService: UrlService,
    private router: Router
  ) { }

  showAppliedLabel(): boolean {
    return this.opportunity.isApplicantRequested();
  }

  showSelectedLabel(): boolean {
    return this.opportunity.isApplicantAccepted()
      || this.opportunity.isCompleted()
      || this.opportunity.isAdvisorEvaluationDone()
      || this.opportunity.isVerified();
  }

  showNotSelectedLabel(): boolean {
    return this.opportunity.isApplicantRejected();
  }

  showForYouLabel(): boolean {
    return this.opportunity.isTargetFixed();
  }

  showClosedLabel(): boolean {
    return this.opportunity.status === OpportunityStatusEnum.L;
  }

  showDisabled() {
    return this.isDiscarded || this.showClosedLabel();
  }

  showNewLabel(): boolean {
    return this.opportunity.isNew && !this.opportunity.alreadyVisited;
  }

  getTimeToDeadline(): string {
    return this.opportunity.deadlineDate ? this.opportunity.deadlineDate.fromNow() : '';
  }

  getNumApplicants(): number {
    return +this.opportunity.numApplicants || this.opportunity.applicants.length;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  budgetInEuros(currency: string): boolean {
    return currency === 'E';
  }

  budgetInDollars(currency: string): boolean {
    return currency === 'D';
  }

  budgetInEXO(currency: string): boolean {
    return currency === 'X';
  }

  showDeadlineRed(): boolean {
    const hoursDiff = this.opportunity.deadlineDate.diff(MomentTZ.now(), 'hours');
    return hoursDiff > 0 && hoursDiff <= 24;
  }

  showDeadlineOrange(): boolean {
    const hoursDiff = this.opportunity.deadlineDate.diff(MomentTZ.now(), 'hours');
    return hoursDiff > 24 && hoursDiff <= 72;
  }

  getStartTime(): MomentTZ.Moment {
    return this.opportunity.startDate;
  }

  goToDetails(opportunity: OpportunityModel): void {
    const path = Urls.ECOSYSTEM_OPPORTUNITIES_DETAIL;
    const url = this.urlService.getPath([path, opportunity.pk]);
    this.router.navigate([url]);
  }
}
