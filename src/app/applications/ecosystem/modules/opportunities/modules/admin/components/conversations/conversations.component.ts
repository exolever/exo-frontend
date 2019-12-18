import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Conversation, ConversationUsers } from '@applications/shared/communication/model/communication.model';
import { AppState } from '@core/store/reducers';
import * as fromOpportunities from '@opportunities/store/reducers';
import { take, tap } from 'rxjs/operators';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';
import { OverlayService } from '@overlay/services/overlay.service';
import {
  MessagesDialogComponent
} from '@applications/shared/communication/components/messages/messages-dialog/messages-dialog.component';
import { OpportunityModel } from '@opportunities/models/opportunity.model';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { Urls, UrlService } from '@app/core';

@Component({
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy {

  conversationSelected$: Observable<any>;
  conversations$: Observable<Conversation[]>;
  subscriptions = new Subscription();
  loading$: Observable<boolean>;
  emptyMoment$: Observable<boolean>;
  replyingMessage$: Observable<boolean>;
  navToConversation$: Observable<number|null>;
  isSmallScreen: boolean;
  connected = false;
  opportunity$: Observable<OpportunityModel>;

  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    private overlayService: OverlayService,
    private urlService: UrlService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.breakpointObserver.observe('(max-width: 960px)') // $screen-md-min;
      .subscribe(state => {
        this.isSmallScreen = state.matches;
      }));

    this.route.params.pipe(
      tap((params) =>
        this.opportunity$ = this.store.pipe(
          select((state) => fromOpportunities.selectOpportunityAdmin(
            state.opportunities.opportunitiesAdmin, params.pk)),
        )
      )
    ).subscribe();
    this.conversations$ = this.store.pipe(
      select((state) => selectorsCommunication.selectAllConversations(state))
    );
    this.conversationSelected$ = this.store.pipe(select(selectorsCommunication.getSelectConversation));
    this.loading$ = this.store.pipe(select((state) => selectorsCommunication.selectLoadingConversations(state)));
    this.replyingMessage$ = this.store.pipe(select((state) => selectorsCommunication.selectReplyingMessages(state)));
    this.navToConversation$ = this.store.pipe(select((state) => selectorsCommunication.selectNavToConversation(state)));
  }

  selectConversation(conversation: Conversation, opportunity: OpportunityModel, cursor?: string) {
    this.store.dispatch(new actionCommunication.ConversationSelected(conversation.id));
    this.store.dispatch(new actionCommunication.LoadConversationMessages(
      { uuid: opportunity.uuid, id: conversation.id, cursor }
      ));

    if (this.isSmallScreen) {
      this.overlayService.open(<Component>MessagesDialogComponent, {
        data: {
          entity: opportunity,
        }
      });
    }
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
      this.store.pipe(
        select(selectorsCommunication.selectNextPageConversations),
        take(1)
      ).subscribe((cursor: string) => {
        if (cursor) {
          this.store.dispatch(new actionCommunication.LoadConversationMessages(
            { uuid: opportunity.uuid, id: conversation.id, cursor}
          ));
        }
      });
    }
  }

  onSubmit(value: {message: string, files: FilestackUploadInterface[]},
           conversation: Conversation,
           opportunity: OpportunityModel
  ) {
    this.store.dispatch(new actionCommunication.ConversationReply(
      {uuid: opportunity.uuid, id: conversation.id, data: { message: value.message, files: value.files } }
    ));
  }

  goToProfile($event, member: ConversationUsers): void {
    $event.stopPropagation();
    $event.preventDefault();
    window.open(this.urlService.getPath([Urls.ECOSYSTEM_PROFILE_VIEW, member.slug]), '_blank');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
