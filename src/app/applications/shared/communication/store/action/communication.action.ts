import { Action } from '@ngrx/store';
import {
  Conversation,
  MessageConversation,
  MessageResponse
} from '@applications/shared/communication/model/communication.model';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';

export const LOAD_CONVERSATIONS = '[Conversations] Load';
export const LOAD_CONVERSATIONS_1_TO_1 = '[Conversations] Load 1 to 1';
export const LOAD_CONVERSATIONS_SUCCESS = '[Conversations] Load Success';
export const LOAD_CONVERSATIONS_FAIL = '[Conversations] Load Fail';
export const ADD_NEW_CONVERSATIONS_SOCKET = '[Conversations] Add new conversation socket';
export const CONVERSATIONS_CONNECT_SOCKET = '[Conversations] Connect Socket';
export const CONVERSATIONS_CONNECT_SOCKET_SUCCESS = '[Conversations] Connect Socket Success';
export const CONVERSATIONS_DISCONNECT_SOCKET = '[Conversations] Disconnect Socket';
export const CONVERSATIONS_DISCONNECT_SOCKET_SUCCESS = '[Conversations] Disconnect Socket Success';
export const CONVERSATIONS_SELECTED = '[Conversations] Selected';
export const CONVERSATIONS_RESET = '[Conversations] Reset';
export const LOAD_CONVERSATION_MESSAGES = '[Conversations] Load Messages';
export const LOAD_CONVERSATION_MESSAGES_1_TO_1 = '[Conversations] Load Messages 1 to 1';
export const LOAD_CONVERSATION_MESSAGES_SUCCESS = '[Conversations] Load Conv Messages success';
export const LOAD_CONVERSATION_MESSAGES_FAIL = '[Conversations] Load Conv Messages Fail';
export const CONVERSATION_REPLY = '[Conversations] Reply';
export const CONVERSATION_REPLY_1_TO_1 = '[Conversations] Reply 1 to 1';
export const CONVERSATION_REPLY_SUCCESS = '[Conversations] Reply Success';
export const CONVERSATION_REPLY_SUCCESS_1_TO_1 = '[Conversations] Reply Success 1 to 1';
export const CONVERSATION_REPLY_FAIL = '[Conversations] Reply Fail';
export const CONVERSATION_RESET_UNREAD = '[Conversations] Reset unread';
export const CONVERSATION_NAVIGATE = '[Conversations] Navigate to a conversation';
export const CONVERSATION_SEE_MESSAGE = '[Conversations] Conversation see message';
export const CONVERSATION_SEE_MESSAGE_1_TO_1 = '[Conversations] Conversation see message 1 to 1';
export const CONVERSATION_SEE_MESSAGE_SUCCESS = '[Conversations] Conversation see message success';
export const CONVERSATION_SEE_MESSAGE_FAIL = '[Conversations] Conversation see message fail';
export const CONVERSATION_SET_TOTAL_UNREAD_1_TO_1 = '[Conversations] Conversation set total unread 1 to 1';

export class LoadConversations implements Action {
  readonly type = LOAD_CONVERSATIONS;
  constructor(public uuid: string, public createByYou?: boolean) { }
}

export class LoadConversation1to1 implements Action {
  readonly type = LOAD_CONVERSATIONS_1_TO_1;
}

export class LoadConversationsSuccess implements Action {
  readonly type = LOAD_CONVERSATIONS_SUCCESS;
  constructor(public payload: Conversation[]) { }
}

export class LoadConversationsFail implements Action {
  readonly type = LOAD_CONVERSATIONS_FAIL;
  constructor(public payload: any) { }
}

export class AddConversationSocket implements Action {
  readonly type = ADD_NEW_CONVERSATIONS_SOCKET;
  constructor(public payload: Conversation) { }
}

export class ConversationsReset implements Action {
  readonly type = CONVERSATIONS_RESET;
}

export class ConversationsConnectSocket implements Action {
  readonly type = CONVERSATIONS_CONNECT_SOCKET;
}

export class ConversationsConnectSocketSuccess implements Action {
  readonly type = CONVERSATIONS_CONNECT_SOCKET_SUCCESS;
}

export class ConversationsDisconnectSocket implements Action {
  readonly type = CONVERSATIONS_DISCONNECT_SOCKET;
}

export class ConversationsDisconnectSocketSuccess implements Action {
  readonly type = CONVERSATIONS_DISCONNECT_SOCKET_SUCCESS;
}

export class ConversationSelected implements Action {
  readonly type = CONVERSATIONS_SELECTED;
  constructor(public payload: number|undefined) { }
}

export class LoadConversationMessages implements Action {
  readonly type = LOAD_CONVERSATION_MESSAGES;
  constructor(public payload: { uuid: string; id: number; cursor?: string }) { }
}

export class LoadConversationMessages1to1 implements Action {
  readonly type = LOAD_CONVERSATION_MESSAGES_1_TO_1;
  constructor(public payload: { idConversation: number, cursor?: string }) { }
}

export class LoadConversationMessagesSuccess implements Action {
  readonly type = LOAD_CONVERSATION_MESSAGES_SUCCESS;
  constructor(public payload: MessageResponse) { }
}

export class LoadConversationMessagesFail implements Action {
  readonly type = LOAD_CONVERSATION_MESSAGES_FAIL;
  constructor(public payload: any) { }
}

export class ConversationReply implements Action {
  readonly type = CONVERSATION_REPLY;
  constructor(public payload: { uuid: string, id: number, data: { message: string, files: any[]}}) { }
}

export class ConversationReply1to1 implements Action {
  readonly type = CONVERSATION_REPLY_1_TO_1;
  constructor(public payload: { id: number, data: { message: string, files: FilestackUploadInterface[]}}) { }
}

export class ConversationReplySuccess implements Action {
  readonly type = CONVERSATION_REPLY_SUCCESS;
  constructor(public payload: MessageConversation) { }
}

export class ConversationReplySuccess1to1 implements Action {
  readonly type = CONVERSATION_REPLY_SUCCESS_1_TO_1;
  constructor(public payload: MessageConversation) { }
}

export class ConversationReplyFail implements Action {
  readonly type = CONVERSATION_REPLY_FAIL;
  constructor(public payload: any) { }
}

export class ConversationResetUnread implements Action {
  readonly type = CONVERSATION_RESET_UNREAD;
  constructor(public payload: Conversation) { }
}

export class ConversationNavigate implements Action {
  readonly type = CONVERSATION_NAVIGATE;
  constructor(public payload: number) { }
}

export class ConversationSeeMessages implements Action {
  readonly type = CONVERSATION_SEE_MESSAGE;
  constructor(public payload: { uuid: string, id: number }) { }
}

export class ConversationSeeMessages1to1 implements Action {
  readonly type = CONVERSATION_SEE_MESSAGE_1_TO_1;
  constructor(public idConversation: number) { }
}

export class ConversationSeeMessagesSuccess implements Action {
  readonly type = CONVERSATION_SEE_MESSAGE_SUCCESS;
  constructor(public payload: string) { }
}

export class ConversationSeeMessagesFail implements Action {
  readonly type = CONVERSATION_SEE_MESSAGE_FAIL;
  constructor(public payload: any) { }
}

export class ConversationSetTotalUnread1to1 implements Action {
  readonly type = CONVERSATION_SET_TOTAL_UNREAD_1_TO_1;
  constructor(public payload: number) { }
}

export type ConversationActions =
  | LoadConversations
  | LoadConversation1to1
  | LoadConversationsSuccess
  | LoadConversationsFail
  | AddConversationSocket
  | ConversationsConnectSocket
  | ConversationsConnectSocketSuccess
  | ConversationsDisconnectSocket
  | ConversationsDisconnectSocketSuccess
  | ConversationSelected
  | LoadConversationMessages
  | LoadConversationMessages1to1
  | LoadConversationMessagesSuccess
  | LoadConversationMessagesFail
  | ConversationReply
  | ConversationReply1to1
  | ConversationReplySuccess
  | ConversationReplySuccess1to1
  | ConversationReplyFail
  | ConversationResetUnread
  | ConversationNavigate
  | ConversationSeeMessages
  | ConversationSeeMessages1to1
  | ConversationSeeMessagesSuccess
  | ConversationSeeMessagesFail
  | ConversationSetTotalUnread1to1
  | ConversationsReset;
