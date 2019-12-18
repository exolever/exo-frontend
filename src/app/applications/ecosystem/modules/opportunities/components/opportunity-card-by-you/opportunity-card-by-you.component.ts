import { Component, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import * as MomentTZ from 'moment-timezone';
import { Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { ManagementActionsEnum } from '@opportunities/shared/opportunities-shared.enum';
import * as opportunitiesActions from '@opportunities/store/actions/opportunities.action';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import {
  ManagementOpportunitiesActionsService
} from '@opportunities/shared/services/management-opportunities-actions.service';

@Component({
  selector: 'app-opportunity-card-by-you',
  templateUrl: './opportunity-card-by-you.component.html',
  styleUrls: ['./opportunity-card-by-you.component.scss']
})
export class OpportunityCardByYouComponent implements OnDestroy {

  @Input() opportunity: OpportunityModel;
  private subscription = new Subscription();
  maxAvatars = 4;

  constructor(
    private actionService: ManagementOpportunitiesActionsService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  manageActions(action: ManagementActionsEnum) {
    switch (action) {
      case ManagementActionsEnum.Edit:
        this.router.navigate([`edit/${this.opportunity.pk.toString()}`], { relativeTo: this.route });
        break;
      case ManagementActionsEnum.Delete:
        this.subscription.add(this.actionService.onDelete().subscribe(res => {
          this.store.dispatch(new opportunitiesActions.DeleteOpportunity({
            pkOpportunity: +this.opportunity.pk,
            message: res
          }));
        }));
        break;
      case ManagementActionsEnum.Close:
        this.subscription.add(
          this.actionService.onClose(<OpportunityModel>this.opportunity).subscribe()
        );
        break;
      case ManagementActionsEnum.Reopen:
        this.actionService.onReopen(<OpportunityModel>this.opportunity);
        break;
    }
  }

  getTimeToDeadline(): string {
    return this.opportunity.deadlineDate ? this.opportunity.deadlineDate.fromNow() : '';
  }

  showDeadlineRed(): boolean {
    return this.opportunity.deadlineDate.diff(MomentTZ.now(),  'hours') <= 24;
  }

  showDeadlineOrange(): boolean {
    const hoursDiff = this.opportunity.deadlineDate.diff(MomentTZ.now(),  'hours');
    return hoursDiff > 24 && hoursDiff <= 72;
  }

  goToDetails(opportunity: OpportunityModel): void {
    this.router.navigate([`${this.opportunity.pk}`], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
