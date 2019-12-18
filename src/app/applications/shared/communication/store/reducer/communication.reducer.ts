import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as actionConversation from '../action/communication.action';
import { uniqueElementsBy } from '@shared/utils/array-uniqueElementsBy';
import { Conversation, MessageResponse } from '@applications/shared/communication/model/communication.model';

const resetUnreads = (entity: Conversation) => {
  // Mark all messages as unread.
  entity.messages.map((m) => {
    m.unread = false;
  });

  // Mark conversation as unread.
  entity.unread = 0;
};

const setScrollPosition = (entity: Conversation, previous: string) => {
  if (previous) {
    // If we are pagination we shouldn't move the scroll.
    entity.scrollPosition = null;
  } else {
    const message = entity.messages.find(m => m.unread === true);
    if (message) {
      // If we have new messages, we put the scroll in the element offsetTop and show the label.
      message.showLabelNewMessages = true;
      entity.scrollPosition = message.id;
    } else {
      // If we haven't unread messages but we had label we delete the label and put the scroll at bottom.
      const labelMessage = entity.messages.find(m => m.showLabelNewMessages === true);
      if (labelMessage) {
        labelMessage.showLabelNewMessages = false;
      }
      entity.scrollPosition = 'bottom';
    }
  }
};

/**
 * Check if the messages should be group when paginate (have payload previous in the response)
 * @param payload
 * @param entity
 * @param previous
 */
const shouldGroup = (payload: MessageResponse, entity: Conversation, previous: string) => {
  if (entity.messages && entity.messages.length > 0
    && payload && payload.results.length > 0 && previous) {
    if (entity.messages[0].user['uuid'] === payload.results[payload.results.length - 1].user) {
      entity.messages[0].mustGroup = true;
    }
  }
};

/**
 * Fill the user messages from conversation users uuid.
 Add item in the first positions array and get the unique messages. We need do the uniqueElements because
 if you haven't load a conversation but someone was writing via socket we add to the entities and when we
 load the conversation we have duplicate messages.
 * @param payload
 * @param entity
 */
const fillMessagesUsers = (payload: MessageResponse, entity: Conversation) => {
  payload.results.map((result) => {
    result.user = entity.users.find(user => user.uuid === result.user);
    if ( entity.messages.findIndex(m => m.id === result.id) === -1) {
      entity.messages.unshift(...payload.results);
      entity.messages = uniqueElementsBy(entity.messages, (a, b) => a.id === b.id);
    }
  });
};


export interface ConversationState extends EntityState<Conversation> {
  loaded: boolean;
  loading: boolean;
  selected: number | undefined;
  replyingMessage: boolean;
  nextPage: string | null;
  previousPage: string | null;
  navToConversation: number | null;
  totalUnread: number;
}

export const conversationAdapter: EntityAdapter<Conversation> =
  createEntityAdapter<Conversation>({
    selectId: (conversation: Conversation) => conversation.id
  });

export const initialState: ConversationState = conversationAdapter.getInitialState({
  selected: undefined,
  loaded: false,
  loading: false,
  replyingMessage: false,
  nextPage: null,
  previousPage: null,
  navToConversation: null,
  totalUnread: 0
});

export function reducer(
  state: ConversationState = initialState,
  action: actionConversation.ConversationActions
): ConversationState {
  const entity = state.entities[state.selected];
  switch (action.type) {
    case actionConversation.LOAD_CONVERSATIONS:
    case actionConversation.LOAD_CONVERSATIONS_1_TO_1:
    case actionConversation.LOAD_CONVERSATION_MESSAGES:
    case actionConversation.LOAD_CONVERSATION_MESSAGES_1_TO_1:
      return {
        ...state,
        loading: true
      };

    case actionConversation.LOAD_CONVERSATIONS_SUCCESS:
      const totalUnread = action.payload.reduce((a, b) =>  {
        return a + (b['unread'] || 0);
      }, 0);

      return conversationAdapter.addAll(action.payload, {
        ...state,
        loaded: true,
        loading: false,
        totalUnread: totalUnread
      });

    case actionConversation.LOAD_CONVERSATIONS_FAIL:
      return {
        ...state,
        loading: false,
      };

    case actionConversation.ADD_NEW_CONVERSATIONS_SOCKET:
      if (entity) {
        if (entity.uuid === action.payload.uuid) {
          return conversationAdapter.addOne(action.payload, {
            ...state
          });
        }
      } else {
        return conversationAdapter.addOne(action.payload, {
          ...state
        });
      }
      break;

    case actionConversation.CONVERSATIONS_RESET:
      return conversationAdapter.removeAll({ ...initialState, totalUnread: state.totalUnread });

    case actionConversation.CONVERSATIONS_SELECTED:
      return {
        ...state,
        selected: action.payload
      };

    case actionConversation.LOAD_CONVERSATION_MESSAGES_SUCCESS:

      const next = action.payload.next ? action.payload.next.split('?')[1] : null;
      const previous = action.payload.previous ? action.payload.previous.split('?')[1] : null;
      const copyEntity = {...entity};
      shouldGroup(action.payload, entity, previous);
      fillMessagesUsers(action.payload, entity);
      setScrollPosition(entity, previous);
      resetUnreads(entity);

      return conversationAdapter.upsertOne(entity, {
        ...state,
        loaded: true,
        loading: false,
        nextPage: next,
        previousPage: previous,
        totalUnread: state.totalUnread - copyEntity.unread,
      });

    case actionConversation.CONVERSATION_REPLY:
    case actionConversation.CONVERSATION_REPLY_1_TO_1:
      return {
        ...state,
        replyingMessage: true
      };

    case actionConversation.CONVERSATION_SEE_MESSAGE_SUCCESS:
      entity.messages.map((m) => {
        m.unread = false;
      });
      return conversationAdapter.upsertOne(entity, {
        ...state,
      });

    case actionConversation.CONVERSATION_RESET_UNREAD:
      const payload = {...action.payload};
      action.payload.unread = 0;
      return conversationAdapter.upsertOne(action.payload, {
        ...state,
        totalUnread: state.totalUnread - payload.unread
      });

    case actionConversation.CONVERSATION_REPLY_SUCCESS:
    case actionConversation.CONVERSATION_REPLY_SUCCESS_1_TO_1:
      const conversation = state.entities[action.payload.conversation];
      const unread =  state.replyingMessage !== true &&
      action.type === actionConversation.CONVERSATION_REPLY_SUCCESS_1_TO_1 ?
        state.totalUnread + 1 : state.totalUnread;
      if (!conversation) {
        return {
          ...state,
          totalUnread: unread
        };
      }

      action.payload.user = conversation.users.find(user => user.uuid === action.payload.user);

      // Group messages if the last item is from the same user that the action.payload (new message)
      if (conversation.messages.length > 0 &&
        conversation.messages[conversation.messages.length - 1].user['uuid'] === action.payload.user.uuid
      ) {
        action.payload.mustGroup = true;
      }

      // If we are replying the message is from us.
      if (state.replyingMessage === true) {
        action.payload.isYour = true;
      }

      // Increase conversation if we have a new message in the conversation but isn't from us.
      if (state.replyingMessage !== true) {
        conversation.unread = conversation.unread + 1;
      }

      conversation.messages.push(action.payload);

      // Sort conversations
      // @ts-ignore
      state.ids.unshift(state.ids.splice(state.ids.indexOf(conversation.id), 1)[0]);

      return conversationAdapter.upsertOne(conversation, {
        ...state,
        replyingMessage: false,
        totalUnread: unread
      });

    case actionConversation.CONVERSATION_NAVIGATE:
      return {
        ...state,
        navToConversation: action.payload,
      };

    case actionConversation.CONVERSATION_SET_TOTAL_UNREAD_1_TO_1:
      return {
        ...state,
        totalUnread: action.payload
      };

    default:
      return state;
  }

}

// Selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = conversationAdapter.getSelectors();

export const selectLoading = (state: ConversationState) => state.loading;
export const selectLoaded = (state: ConversationState) => state.loaded;
export const selectReplyingMessage = (state: ConversationState) => state.replyingMessage;
export const selectSelected = (state: ConversationState) => state.selected;
export const selectNextPage = (state: ConversationState) => state.nextPage;
export const selectPreviousPage = (state: ConversationState) => state.previousPage;
export const selectNavToConversation = (state: ConversationState) => state.navToConversation;
export const selectTotalUnread = (state: ConversationState) => state.totalUnread;
