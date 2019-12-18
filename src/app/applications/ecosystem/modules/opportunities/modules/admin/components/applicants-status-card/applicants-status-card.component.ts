import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';
import { OpportunityApplicantModel } from '@ecosystem/modules/opportunities/models/opportunity-applicant.model';
import {
  ManagementOpportunitiesActionsService
} from '@opportunities/shared/services/management-opportunities-actions.service';

@Component({
  selector: 'app-applicants-status-card',
  templateUrl: './applicants-status-card.component.html',
  styleUrls: ['./applicants-status-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantsStatusCardComponent implements OnDestroy, OnInit {
  @Input() opportunity: OpportunityModel;
  @Input() maxAvatars: number;
  selectedApplicants: OpportunityApplicantModel[];
  private subscription = new Subscription();

  constructor(
    private actionService: ManagementOpportunitiesActionsService,
  ) { }

  ngOnInit() {
    this.selectedApplicants = this.opportunity.applicants.filter(
      app => app.isSelected() || app.isCompleted() || app.isFeedbackInvolved());
  }

  showCloseAction() {
    return this.opportunity.canClose();
  }

  closeOpportunity() {
    this.subscription.add(
      this.actionService.onClose(this.opportunity).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
