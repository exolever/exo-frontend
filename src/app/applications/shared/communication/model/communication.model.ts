import * as MomentTZ from 'moment-timezone';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { WsConversationActions } from '@applications/sockets/config/config';

export interface MessageResponse {
  next: string|null;
  previous: string|null;
  results: MessageConversation[];
}

export class ConversationUsers {
  name: string;
  profilePicture: string;
  userTitle: string;
  uuid: string;
  slug: string;

  constructor(response: ConversationUsers) {
    Object.assign(this, response);
  }

}

export interface MessageConversation {
  message: string;
  id: number;
  user: string | ConversationUsers;
  conversation: number;
  unread: boolean;
  files: Array<FilestackUploadInterface>;
  isYour?: boolean;
  mustGroup?: boolean;
  showLabelNewMessages?: boolean;
  created?: MomentTZ.Moment;
  action?: WsConversationActions;
}

export interface ResponseConversation {
  id: number;
  uuid?: string;
  name: string;
  totalUnread: number;
  icon: string;
  users: Array<ConversationUsers>;
  messages: Array<MessageConversation>;
  UUIDRelatedObject: string;
}

export class Conversation {
  id: number;
  name: string;
  unread: number;
  totalMembers: number;
  image: string;
  users: Array<ConversationUsers>;
  messages?: Array<MessageConversation>;
  scrollPosition: string | number;
  uuid: string;

  constructor(response?: ResponseConversation) {

    if (!response) {
      return;
    }

    this.id = response.id;
    this.name = response.name;
    this.unread = response.totalUnread;
    this.totalMembers = response.users ? response.users.length : 0;
    this.users = response.users.map(user => new ConversationUsers(user));
    this.messages = response.messages ? response.messages : [];
    this.image = response.icon;
    this.uuid = response.UUIDRelatedObject;
  }

}
