import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subscription, throwError } from 'rxjs';
import {
  Conversation,
  MessageConversation,
  ResponseConversation
} from '@applications/shared/communication/model/communication.model';
import { SocketService } from '@applications/sockets/service/socket.service';
import {
  WebSocketPayload,
  WsConversationActions,
  WsEvents,
  WsSubscriptionsName
} from '@applications/sockets/config/config';
import { ApiResources, UrlService, UserService } from '@app/core';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { AppState } from '@core/store/reducers';

import * as actionConversation from '../store/action/communication.action';

@Injectable()
export class CommunicationService {

  private subMessages: Subscription;

  constructor(
    private socket: SocketService,
    private urlService: UrlService,
    private httpClient: HttpClient,
    private userService: UserService,
    private store: Store<AppState>,
  ) { }

  getMessages() {
    this.connectWsConversations();

    if (this.subMessages) {
      return;
    }

    this.subMessages = this.socket.messages$.pipe(
      map(message => JSON.parse(message)),
      filter((message: WebSocketPayload) => message.subscription === WsSubscriptionsName.C),
      tap(message => this.manageUpdate(message)),
    ).subscribe();
  }

  manageUpdate(message) {
    if (message.data && message.data.action === WsConversationActions.NM) {
      if (message.data.Type === 'U') {
        this.store.dispatch(new actionConversation.ConversationReplySuccess1to1(message.data));
        return false;
      }
      this.store.dispatch(new actionConversation.ConversationReplySuccess(message.data));
    }

    if (message.data && message.data.action === WsConversationActions.NC) {
      if (message.data.Type === 'U') {
        this.store.dispatch(
          new actionConversation.AddConversationSocket(this.serializeMailboxResponse(message.data))
        );
        return false;
      }
      this.store.dispatch(new actionConversation.AddConversationSocket(new Conversation(message.data)));
    }
  }

  serializeMailboxResponse(conversation): Conversation {
      let userIcon;
      this.userService.user$.pipe(
        take(1)
      ).subscribe((user) => {
        userIcon = conversation.users.find(u => u.uuid !== user.uuid);
        conversation.icon = userIcon.profilePicture;
        conversation.name = userIcon.name;
      });
      return new Conversation(conversation);
  }

  /**
   * Retrieve list conversations.
   * @param uuid Should be the uuid of a project.
   * @param createdByYou To get only your conversations (delivery in detail).
   * Example: /conversations/api/652b3fb6-f57f-4871-9a3e-80ee0660f328/conversations/
   */
  public getConversations(uuid: string, createdByYou = false) {
    let url = this.urlService.resolveConversationsApi(ApiResources.CONVERSATION_LIST, uuid);
    if (createdByYou) {
      url = this.urlService.resolveGetParams(
        url,
        ['created_by_you'],
        [`${createdByYou}`]
      );
    }
    return this.httpClient.get(url).pipe(
      tap((conversations: ResponseConversation[]) => conversations),
      map(conversations => conversations.map(conv => new Conversation(conv))),
      catchError(err => throwError(err))
    );
  }

  public getMailboxConversations() {
    const url = this.urlService.resolveConversationsApi(ApiResources.CONVERSATION_MAILBOX);
    return this.httpClient.get(url)
      .pipe(
        map(res => res)
      );
  }

  public getMailboxMessages(idConversation: number, cursor: string) {
    let url = this.urlService.resolveConversationsApi(
      ApiResources.CONVERSATION_MAILBOX_LIST, idConversation.toString()
    );

    if (cursor) {
      url = `${url}?${cursor}`;
    }

    return this.serializeMessages(url);
  }

  getUserConversationUuid(uuid) {
    let url = this.urlService.resolveConversationsApi(
      ApiResources.CONVERSATION_MAILBOX
    );
    url = `${url}?user_to=${uuid}`;

    return this.httpClient.get(url);
  }

  userStartConversation(pk, data) {
    return this.httpClient.post(
      this.urlService.resolveAPI(ApiResources.PROFILE_START_CONVERSATION, pk),
      data
    );
  }

  serializeMessages(url) {
    return this.httpClient.get(url).pipe(
      tap(messages => {
        messages['results'].reverse();
        this.userService.user$.pipe(
          take(1)
        ).subscribe((user) => {
          messages['results'].map((message: MessageConversation, index: number) => {
            message.mustGroup = false;
            if (index > 0) {
              message.mustGroup = messages['results'][index - 1].user === message.user;
            }
            if (message.user === user.uuid) {
              message.isYour = true;
            }
          });
        });
        return messages;
      }),
      catchError(err => throwError(err))
    );
  }

  /**
   * Retrieve list of messages.
   * Fill the messages Interface with the properties mustGroup and isYour.
   * Must Group is to show the messages together in.
   * isYour is to know if the messages is from other user or as the name said is your own message.
   * @param uuid Must be the uuid of a project.
   * @param id Must be the id of a conversation.
   * @param cursor To paginate next|previous page.
   * Example: /conversations/api/9252bd28-3348-4062-8a54-6a5f10176266/conversations/10/messages/
   */
  public getConversationMessages(uuid: string, id: string, cursor?: string) {
    let url = this.urlService.resolveConversationsApi(ApiResources.CONVERSATION_MESSAGES_LIST, uuid, id);

    if (cursor) {
      url = `${url}?${cursor}`;
    }

    return this.serializeMessages(url);
  }

  /**
   * Reply to conversation in a project.
   * @param uuid Must be the uuid of a project.
   * @param id Must be the id of a conversation.
   * @param data Object with the message from the users and an array of files from filestack.
   * Example: conversations/api/ab575b9d-c327-453a-8b50-4dc95cca3114/conversations/10/reply/
   */
  public replyConversation(uuid: string, id: string, data: { message: string, files: FilestackUploadInterface[]}) {
    const url = this.urlService.resolveConversationsApi(ApiResources.CONVERSATION_REPLY, uuid, id);
    return this.httpClient.post(url, data).pipe(
      tap((message: MessageConversation) => message),
      catchError(err => throwError(err))
    );
  }

  public replyConversationMailbox(id: string, data: { message: string, files: FilestackUploadInterface[]}) {
    const url = this.urlService.resolveConversationsApi(ApiResources.CONVERSATION_MAILBOX_REPLY, id);
    return this.httpClient.post(url, data).pipe(
      tap((message: MessageConversation) => message),
      catchError(err => throwError(err))
    );
  }

  public createOppConversation(pkOpportunity: number, data: { message: string, files: FilestackUploadInterface[]}) {
    const url = this.urlService.resolve(ApiResources.OPP_CREATE_CONVERSATION, pkOpportunity.toString());
    // Backend response is a empty body
    return this.httpClient.post(url, data).pipe(
      catchError(err => throwError(err))
    );
  }

  /**
   * Total conversations unread.
   * @param uuid Must be the uuid of a project.
   * Example: /conversations/api/4ce1b6a9-bfc3-4b9d-a6a0-16f818009b73/conversations/total-unread/
   */
  public totalUnreadConversations(uuid: string) {
    const url = this.urlService.resolveConversationsApi(ApiResources.CONVERSATION_UNREAD, uuid);
    return this.httpClient.get(url).pipe(
      map((res: number) => {
        return { total: res };
      }),
      catchError(err => throwError(err))
    );
  }

  /**
   * Mark all conversation's messages as readed.
   * @param uuid Entity, can be project|opportunity...
   * @param id Conversation id
   */
  public markAsRead(uuid: string, id: number) {
    const url = this.urlService.resolveConversationsApi(ApiResources.CONVERSATION_MARK_AS_READ, uuid, id.toString());
    return this.httpClient.put(url, {}).pipe(
      tap((response: string) => response),
      catchError(err => throwError(err))
    );
  }

  /**
   * Mark all conversation's messages as readed.
   * @param id Conversation id
   */
  public markAsRead1to1(id: number) {
    const url = this.urlService.resolveConversationsApi(ApiResources.CONVERSATION_MAILBOX_MARK_AS_READ, id.toString());
    return this.httpClient.put(url, {}).pipe(
      tap((response: string) => response),
      catchError(err => throwError(err))
    );
  }

  public connectWsConversations() {
    this.socket.emit(WsEvents.SUBSCRIBE, WsSubscriptionsName.C);
    this.socket.addConnectedWs({name: WsSubscriptionsName.C});
  }

  public closeWsConversation() {
    this.socket.emit(WsEvents.UNSUBSCRIBE, WsSubscriptionsName.C);
    this.socket.removeConnectedWs(WsSubscriptionsName.C);
  }

}
