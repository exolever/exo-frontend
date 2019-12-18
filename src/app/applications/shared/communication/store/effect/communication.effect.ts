import { Injectable } from '@angular/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { Conversation } from '@applications/shared/communication/model/communication.model';
import { MailboxService } from '@ecosystem/modules/mailbox/services/mailbox.service';

import * as actionConversation from '../action/communication.action';
import {
  ConversationReply, ConversationReply1to1,
  ConversationSeeMessages, ConversationSeeMessages1to1, LoadConversation1to1,
  LoadConversationMessages, LoadConversationMessages1to1,
  LoadConversations
} from '../action/communication.action';

@Injectable()
export class CommunicationEffect {

  @Effect()
  loadConversation$ = this.actions$.pipe(
    ofType(actionConversation.LOAD_CONVERSATIONS),
    switchMap((res: LoadConversations) => this.communicationService.getConversations(res.uuid, res.createByYou).pipe(
      map((conversations: Conversation[]) => new actionConversation.LoadConversationsSuccess(conversations)),
      catchError(error => of(new actionConversation.LoadConversationsFail(error)))
    ))
  );

  @Effect()
  loadConversation1to1$ = this.actions$.pipe(
    ofType(actionConversation.LOAD_CONVERSATIONS_1_TO_1),
    switchMap((res: LoadConversation1to1) => this.mailboxService.getAllConversations().pipe(
      map((conversations: Conversation[]) => new actionConversation.LoadConversationsSuccess(conversations)),
      catchError(error => of(new actionConversation.LoadConversationsFail(error)))
    ))
  );

  @Effect()
  connectSocketConversation$ = this.actions$.pipe(
    ofType(actionConversation.CONVERSATIONS_CONNECT_SOCKET),
    tap(() => this.communicationService.getMessages()),
    map(() => new actionConversation.ConversationsConnectSocketSuccess())
  );

  @Effect()
  disconnectSocketConversation$ = this.actions$.pipe(
    ofType(actionConversation.CONVERSATIONS_DISCONNECT_SOCKET),
    tap(() => this.communicationService.closeWsConversation()),
    map(() => new actionConversation.ConversationsDisconnectSocketSuccess())
  );

  @Effect()
  loadConversationMessages$ = this.actions$.pipe(
    ofType(actionConversation.LOAD_CONVERSATION_MESSAGES),
    switchMap((res: LoadConversationMessages) => this.communicationService.getConversationMessages(
      res.payload.uuid, res.payload.id.toString(), res.payload.cursor).pipe(
        map((messages: any) => new actionConversation.LoadConversationMessagesSuccess(messages)),
        catchError(error => of(new actionConversation.LoadConversationMessagesFail(error)))
      )
    )
  );

  @Effect()
  loadConversationMessages1to1$ = this.actions$.pipe(
    ofType(actionConversation.LOAD_CONVERSATION_MESSAGES_1_TO_1),
    switchMap((res: LoadConversationMessages1to1) => this.mailboxService.getMessages(
      res.payload.idConversation, res.payload.cursor).pipe(
        map((messages: any) => new actionConversation.LoadConversationMessagesSuccess(messages)),
        catchError(error => of(new actionConversation.LoadConversationMessagesFail(error)))
    ))
  );

  @Effect()
  replyConversation$ = this.actions$.pipe(
    ofType(actionConversation.CONVERSATION_REPLY),
    switchMap((res: ConversationReply) => this.communicationService.replyConversation(
      res.payload.uuid, res.payload.id.toString(), res.payload.data
    ).pipe(
      map((reply: any) => new actionConversation.ConversationReplyFail(reply)),
      catchError(error => of(new actionConversation.ConversationReplyFail(error)))
    ))
  );

  @Effect()
  replyConversation1to1$ = this.actions$.pipe(
    ofType(actionConversation.CONVERSATION_REPLY_1_TO_1),
    switchMap((res: ConversationReply1to1) => this.mailboxService.replyConversation(
      res.payload.id.toString(), res.payload.data
    ).pipe(
      map((reply: any) => new actionConversation.ConversationReplyFail(reply)),
      catchError(error => of(new actionConversation.ConversationReplyFail(error)))
    ))
  );

  @Effect()
  seeMessages$ = this.actions$.pipe(
    ofType(actionConversation.CONVERSATION_SEE_MESSAGE),
    switchMap((res: ConversationSeeMessages) =>
      this.communicationService.markAsRead(res.payload.uuid, res.payload.id).pipe(
        map((status: string) => new actionConversation.ConversationSeeMessagesSuccess(status)),
        catchError(error => of(new actionConversation.ConversationSeeMessagesFail(error)))
      )),
  );

  @Effect()
  seeMessages1to1$ = this.actions$.pipe(
    ofType(actionConversation.CONVERSATION_SEE_MESSAGE_1_TO_1),
    switchMap((res: ConversationSeeMessages1to1) =>
      this.mailboxService.markAsRead1to1(res.idConversation).pipe(
        map((status: string) => new actionConversation.ConversationSeeMessagesSuccess(status)),
        catchError(error => of(new actionConversation.ConversationSeeMessagesFail(error)))
      )),
  );

  constructor(
    private actions$: Actions,
    private communicationService: CommunicationService,
    private mailboxService: MailboxService,
  ) { }

}
