import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OverlayReference } from '@overlay/overlay-ref';
import { AppState } from '@core/store/reducers';
import { select, Store } from '@ngrx/store';
import { DATA } from '@overlay/services/overlay.service';

import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';
import { MailboxService } from '@ecosystem/modules/mailbox/services/mailbox.service';
import { Conversation } from '@applications/shared/communication/model/communication.model';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss']
})
export class UserChatComponent implements OnInit, OnDestroy {

  conversation$ = this.store.pipe(select(selectorsCommunication.getSelectConversation));
  conversationExists: boolean;

  constructor(
    private overlayRef: OverlayReference,
    private store: Store<AppState>,
    private mailboxService: MailboxService,
    @Inject(DATA) public data: any
  ) { }

  ngOnInit() {
    this.conversationExists = !(this.data.conversation && this.data.conversation.length === 0);
  }

  submit(data: any, conversation?: Conversation) {
    if (!this.conversationExists) {
      this.mailboxService.userStartConversation(this.data.user.pk, data).subscribe(() => {
        this.mailboxService.getUserConversationUuid(this.data.user.uuid).subscribe((conv: Conversation[]) => {
          this.conversationExists = true;
          this.data.conversation = conv[0];
          this.store.dispatch(new actionCommunication.LoadConversationsSuccess(conv));
          this.store.dispatch(new actionCommunication.ConversationSelected(conv[0].id));
          this.store.dispatch(new actionCommunication.LoadConversationMessages1to1({idConversation: conv[0].id}));
        });
      });
    } else {
      this.store.dispatch(new actionCommunication.ConversationReply1to1(
        { id: conversation.id, data})
      );
    }
  }

  onScroll(direction: string, conversation: Conversation) {
    if (direction === 'down') {
      this.store.dispatch(new actionCommunication.ConversationResetUnread(conversation));
      this.store.dispatch(new actionCommunication.ConversationSeeMessages1to1(conversation.id));
    }

    if (direction === 'up') {
      this.store.pipe(
        select(selectorsCommunication.selectNextPageConversations),
        take(1)
      ).subscribe((cursor: string) => {
        if (cursor) {
          this.store.dispatch(new actionCommunication.LoadConversationMessages1to1(
            { idConversation: conversation.id, cursor}
          ));
        }
      });
    }
  }

  close() {
    this.overlayRef.close(false);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new actionCommunication.ConversationSelected(undefined));
    if (this.data.fromProfile) {
      this.store.dispatch(new actionCommunication.ConversationsReset());
    }
  }
}
