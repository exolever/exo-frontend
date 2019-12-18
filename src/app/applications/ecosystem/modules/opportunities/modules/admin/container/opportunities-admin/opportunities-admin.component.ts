import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@core/store/reducers';
import { OpportunityModel } from '@ecosystem/modules/opportunities/models/opportunity.model';
import * as fromOpportunities from '@ecosystem/modules/opportunities/store/reducers';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';
import { Conversation } from '@applications/shared/communication/model/communication.model';

import * as opportunitiesAdminActions from '../../store/actions/opportunities-admin.action';

@Component({
  selector: 'app-opportunities-admin',
  templateUrl: './opportunities-admin.component.html',
  styleUrls: ['./opportunities-admin.component.scss']
})
export class OpportunitiesAdminComponent implements OnInit, OnDestroy {
  opportunity$: Observable<OpportunityModel>;
  subscriptions = new Subscription();
  loading$: Observable<boolean>;
  tabs: any[];
  conversations: Conversation[];
  totalUnreadMessages: number;
  connected = false;

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadCrumbService,
    private translate: TranslateService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.route.params.pipe(
      tap((params) => this.store.dispatch(new opportunitiesAdminActions.LoadOpportunityAdmin(params.pk))),
      tap((params) =>
        this.opportunity$ = this.store.pipe(
          select((state) => fromOpportunities.selectOpportunityAdmin(
            state.opportunities.opportunitiesAdmin, params.pk)),
          tap((opportunity: OpportunityModel) => {
            if (opportunity) {
              this.buildTabs(opportunity);
              this.breadcrumbService.updateBreadCrumb({label: opportunity.subject});
              if (!this.connected && opportunity.uuid) {
                this.connected = true;
                this.store.dispatch(new actionCommunication.LoadConversations(opportunity.uuid));
                this.store.dispatch(new actionCommunication.ConversationsConnectSocket());
              }
            }
          })
        )
      )
    ).subscribe());

    this.loading$ = this.store.pipe(
      select((state) => fromOpportunities.selectAdminIsLoading(state.opportunities))
    );
    this.subscriptions.add(this.store.pipe(select(state => selectorsCommunication.selectAllConversations(state)))
      .subscribe((conversations: Conversation[]) => {
        this.conversations = conversations;
        if (conversations.length > 0) {
          this.totalUnreadMessages = this.calculateTotalMessagesUnread(conversations);
          if (this.tabs) {
            const conversationTab = this.tabs.find(tab => tab['link'] === 'conversations');
            if (conversationTab) {
              conversationTab['showBadge'] = this.totalUnreadMessages > 0;
            }
          }
        }
      })
    );
  }

  calculateTotalMessagesUnread(conversations: Conversation[]): number {
    let total = 0;
    conversations.map(conversation => {
      total += conversation.unread;
    });
    return total;
  }

  private buildTabs(opportunity: OpportunityModel): void {
    this.tabs = [
      {
        label: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.TABS.APPLICANTS'),
        link: 'applicants',
      },
      {
        label: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.TABS.CONVERSATIONS'),
        link: 'conversations',
      },
    ];
    if (opportunity.isTargetFixed()) {
      this.tabs.unshift(
        {
          label: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.TABS.RECIPIENTS'),
          link: 'recipients',
        }
      );
    }
    if (opportunity.applicants && opportunity.applicants.length > 0) {
      this.tabs.push({
        label: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.TABS.FEEDBACK'),
        link: 'feedback',
      });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new actionCommunication.ConversationsReset());
    this.subscriptions.unsubscribe();
  }

}
