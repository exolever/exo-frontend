import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { Conversation } from '@applications/shared/communication/model/communication.model';
import { AppState } from '@core/store/reducers';
import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';
import { ManagementActionsEnum } from '@ecosystem/modules/opportunities/shared/opportunities-shared.enum';
import {
  ManagementOpportunitiesActionsService
} from '@opportunities/shared/services/management-opportunities-actions.service';
import * as opportunitiesActions from '@ecosystem/modules/opportunities/store/actions/opportunities.action';

@Component({
  selector: 'app-opportunity-info',
  templateUrl: './opportunity-info.component.html',
  styleUrls: ['./opportunity-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityInfoComponent implements OnInit, OnDestroy {
  @Input() opportunity: OpportunityModel;
  @Input() conversations: Conversation[];
  @Input() totalUnreadMessages: number;
  showDesc = false;
  showBtnText: string;
  duration: string;
  private subscriptions = new Subscription();

  constructor(
    private actionService: ManagementOpportunitiesActionsService,
    private store: Store<AppState>,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.showBtnText = this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.SHOW_MORE');
  }

  manageActions(action: ManagementActionsEnum) {
    switch (action) {
      case ManagementActionsEnum.Edit:
        this.router.navigate([`../edit/${this.opportunity.pk.toString()}`], { relativeTo: this.route });
        break;
      case ManagementActionsEnum.Delete:
        // Url remove the last part to navigate into parent.
        const urlToNavigate = this.router.url.replace(/[0-9]+\/applicants/, '');
        this.subscriptions.add(this.actionService.onDelete().subscribe(res => {
          this.store.dispatch(new opportunitiesActions.DeleteOpportunity({
            pkOpportunity: this.opportunity.pk,
            message: res,
            urlToNavigate: urlToNavigate
          }));
        }));
        break;
      case ManagementActionsEnum.Close:
        this.subscriptions.add(
          this.actionService.onClose(this.opportunity).subscribe()
        );
        break;
      case ManagementActionsEnum.Reopen:
        this.actionService.onReopen(<OpportunityModel>this.opportunity);
        break;
    }
  }

  showBtn() {
    this.showDesc = !this.showDesc;
    this.showBtnText = this.showDesc
      ? this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.SHOW_LESS')
      : this.translateService.instant('ECOSYSTEM.OPPORTUNITIES.SHOW_MORE');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
