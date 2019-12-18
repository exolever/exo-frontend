export enum WsObjectName {
  POST = 'post',
  ANSWER = 'answer'
}

export enum WsEvents {
  AUTH = 'auth',
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  MESSAGE = 'message',
}

export enum WsSubscriptionsName {
  C = 'conversations.conversations',
  SWARM = 'core.swarm',
  CONNECTED_USERS = 'auth.connected',
  USER = 'core.user',
  PROJECT = 'core.project',
  GENERIC_PROJECT = 'projects.projects'
}

export enum WsConversationActions {
  S = 'see',
  NC = 'new-conversations',
  NM = 'new-message',
  SM = 'see-message',
  CREATE = 'create',
  DELETE = 'delete',
  UPDATE = 'update',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

export enum WsUserActions {
  UPDATE = 'update'
}

export enum WsProjectActions {
  CREATE = 'create',
  UPDATE = 'update'
}

export enum WsProjectObjects {
  MICROLEARNING_AVERAGE = 'microlearningaverage',
  USER_TYPEFORM_FEEDBACK = 'usergenerictypeformfeedback'
}

export enum WsStatus {
  ERROR = 'error',
  OK = 'ok'
}

export interface WebSocketPayload {
  event: string;
  subscription?: WsSubscriptionsName;
  status?: WsStatus;
  error?: string;
  data?: {
    action: WsConversationActions | WsUserActions | WsProjectActions;
    object: string;
    payload: JSON;
  };
}

export interface ConnectedWSInterface {
  name: WsSubscriptionsName;
  parameters?: any;
}
