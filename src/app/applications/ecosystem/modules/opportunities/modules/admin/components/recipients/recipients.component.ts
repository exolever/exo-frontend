import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { OpportunityRecipientModel } from '@opportunities/models/opportunity-recipient.model';
import { ManageMatMenuComponent } from '@shared/components/extendables/manage-mat-menu.component';
import { AppState } from '@core/store/reducers';
import * as fromOpportunities from '@ecosystem/modules/opportunities/store/reducers';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import { Conversation } from '@applications/shared/communication/model/communication.model';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';

import { OpportunitiesManageActionsService } from '../../service/opportunies-manage-actions.service';

@Component({
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.scss']
})
export class RecipientsComponent extends ManageMatMenuComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();
  opportunity: OpportunityModel;
  conversations: Conversation[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private manageActionsService: OpportunitiesManageActionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subscriptions.add(this.store.pipe(select(
        (state) => fromOpportunities.selectOpportunityAdmin(state.opportunities.opportunitiesAdmin, params.pk))
      ).subscribe((opportunity: OpportunityModel) => {
        this.opportunity = opportunity;
        this.getConversationsForRecipients();
      }));
    });
  }

  getConversationsForRecipients() {
    this.subscriptions.add(this.store.pipe(
      select(state => selectorsCommunication.selectAllConversations(state))).subscribe(
        (conversations: Conversation[]) => {
          // Ñaas: We need to know the conversation related with every recipient. Backend "can't" send in the recipient
          // list, So i need iterate the conversations and the users to find the uuid recipient.
          if (this.opportunity) {
            this.opportunity.recipients.map((recipient: OpportunityRecipientModel) => {
              conversations.map((conversation: Conversation) => {
                conversation.users.map(user => {
                  if (recipient.uuid === user.uuid) {
                    recipient.conversation = conversation.id;
                  }
                });
              });
            });
          }
        }
      )
    );
  }

  onConversation(recipient: OpportunityRecipientModel) {
    this.manageActionsService.goToConversation(recipient.conversation);
    this.router.navigate([`conversations`], { relativeTo: this.route.parent });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
