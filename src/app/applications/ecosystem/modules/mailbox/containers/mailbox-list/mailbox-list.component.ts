import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Conversation } from '@applications/shared/communication/model/communication.model';
import { AppState } from '@core/store/reducers';

import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { take } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OverlayService } from '@overlay/services/overlay.service';
import { UserChatComponent } from '@applications/shared/communication/components/user-chat/user-chat.component';

@Component({
  templateUrl: './mailbox-list.component.html',
  styleUrls: ['./mailbox-list.component.scss'],
})
export class MailboxListComponent implements OnInit, OnDestroy {

  conversations$: Observable<Conversation[]>;
  conversationSelected$: Observable<Conversation>;
  loading$: Observable<boolean>;
  replyingMessage$: Observable<boolean>;

  subscriptions = new Subscription();
  isSmallScreen: boolean;

  constructor(
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver,
    private overlayService: OverlayService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.breakpointObserver.observe('(max-width: 960px)') // $screen-md-min;
      .subscribe(state => {
        this.isSmallScreen = state.matches;
      }));

    this.store.dispatch(new actionCommunication.ConversationsReset());
    this.store.dispatch(new actionCommunication.LoadConversation1to1());
    this.conversationSelected$ = this.store.pipe(select(selectorsCommunication.getSelectConversation));
    this.loading$ = this.store.pipe(select((state) => selectorsCommunication.selectLoadingConversations(state)));
    this.conversations$ = this.store.pipe(
      select((state) => selectorsCommunication.selectAllConversations(state))
    );
    this.replyingMessage$ = this.store.pipe(select((state) => selectorsCommunication.selectReplyingMessages(state)));
  }

  loadMessages(conversation: Conversation) {
    this.store.dispatch(new actionCommunication.ConversationSelected(conversation.id));
    this.store.dispatch(new actionCommunication.LoadConversationMessages1to1({idConversation: conversation.id}));
    if (this.isSmallScreen) {
      this.overlayService.open(<Component>UserChatComponent, {
        data: {
          conversation: conversation
        }
      });
    }
  }

  onSubmit(value: {message: string, files: FilestackUploadInterface[]}, conversation: Conversation) {
    this.store.dispatch(new actionCommunication.ConversationReply1to1(
      {id: conversation.id, data: { message: value.message, files: value.files }}
    ));
  }

  onScroll(direction: string, conversation: Conversation) {
    if (direction === 'down') {
      this.store.dispatch(new actionCommunication.ConversationResetUnread(conversation));
      this.store.dispatch(new actionCommunication.ConversationSeeMessages1to1(conversation.id));
    }

    if (direction === 'up') {
      this.subscriptions.add(this.store.pipe(
        select(selectorsCommunication.selectNextPageConversations),
        take(1)
      ).subscribe((cursor: string) => {
        if (cursor) {
          this.store.dispatch(new actionCommunication.LoadConversationMessages1to1(
            { idConversation: conversation.id, cursor}
          ));
        }
      }));
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new actionCommunication.ConversationsReset());
    this.subscriptions.unsubscribe();
  }

}
