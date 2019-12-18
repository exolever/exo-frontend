import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import * as fromOpportunities from '../../store/reducers';
import { ActivatedRoute } from '@angular/router';
import { filter, take, tap } from 'rxjs/operators';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';
import { Conversation } from '@applications/shared/communication/model/communication.model';
import { Observable, Subscription } from 'rxjs';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';

@Component({
  selector: 'app-opportunity-chat',
  templateUrl: './opportunity-chat.component.html',
  styleUrls: ['./opportunity-chat.component.scss']
})
export class OpportunityChatComponent implements OnInit, OnDestroy {

  conversation: Conversation;
  connected = false;
  loadedMessages = false;
  loading$: Observable<boolean>;
  replyingMessage$: Observable<boolean>;
  opportunity: OpportunityModel;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private communicationService: CommunicationService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.route.params.pipe(
      tap(params => this.store.pipe(
        select(state => fromOpportunities.selectOpportunity(state.opportunities.opportunities, params.pk)),
        filter(opportunity => !!opportunity),
        tap(opportunity => {
          if (!this.connected && opportunity.uuid) {
            this.opportunity = opportunity;
            this.connected = true;
            this.store.dispatch(new actionCommunication.LoadConversations(opportunity.uuid, true));
            this.subscriptions.add(this.store.pipe(
              select(state => selectorsCommunication.selectAllConversations(state)),
            ).subscribe((conversations: Conversation[]) => {
              this.conversation = conversations[0];
              if (this.conversation && !this.loadedMessages) {
                this.loadedMessages = true;
                this.selectConversation(this.conversation, opportunity);
              }
            }));
          }
        })
      ).subscribe()))
      .subscribe());

    this.loading$ = this.store.pipe(select((state) => selectorsCommunication.selectLoadingConversations(state)));
    this.replyingMessage$ = this.store.pipe(select((state) => selectorsCommunication.selectReplyingMessages(state)));
  }

  selectConversation(conversation: Conversation, opportunity: OpportunityModel, cursor?: string) {
    this.store.dispatch(new actionCommunication.ConversationSelected(conversation.id));
    this.store.dispatch(new actionCommunication.LoadConversationMessages(
      {uuid: opportunity.uuid, id: conversation.id, cursor}
    ));
  }

  onScroll(direction: string, conversation: Conversation, opportunity: OpportunityModel) {
    if (direction === 'down') {
      this.store.dispatch(new actionCommunication.ConversationResetUnread(conversation));
      this.store.dispatch(new actionCommunication.ConversationSeeMessages({
        uuid: opportunity.uuid,
        id: conversation.id,
      }));
    }

    if (direction === 'up') {
      this.subscriptions.add(this.store.pipe(
        select(selectorsCommunication.selectNextPageConversations),
        take(1)
      ).subscribe((cursor: string) => {
        if (cursor) {
          this.store.dispatch(new actionCommunication.LoadConversationMessages(
            {uuid: opportunity.uuid, id: conversation.id, cursor}
          ));
        }
      }));
    }
  }

  onSubmit(value: { message: string, files: FilestackUploadInterface[] },
           conversation: Conversation,
           opportunity: OpportunityModel
  ) {
    if (!conversation) {
      this.subscriptions.add(this.communicationService.createOppConversation(opportunity.pk, value)
        .subscribe());
    } else {
      this.store.dispatch(new actionCommunication.ConversationReply(
        {uuid: opportunity.uuid, id: conversation.id, data: {message: value.message, files: value.files}}
      ));
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new actionCommunication.ConversationsReset());
    this.subscriptions.unsubscribe();
  }
}
