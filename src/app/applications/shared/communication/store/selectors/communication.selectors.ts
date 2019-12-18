import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromConversation from '@applications/shared/communication/store/reducer/communication.reducer';

const selectConversationState = createFeatureSelector<fromConversation.ConversationState>('communication');
export const selectAllConversations = createSelector(selectConversationState, fromConversation.selectAll);
export const selectLoadingConversations = createSelector(selectConversationState, fromConversation.selectLoading);
export const selectReplyingMessages = createSelector(selectConversationState, fromConversation.selectReplyingMessage);
export const selectLoadedConversations = createSelector(selectConversationState, fromConversation.selectLoaded);
export const selectNextPageConversations = createSelector(selectConversationState, fromConversation.selectNextPage);
export const selectTotalUnread = createSelector(selectConversationState, fromConversation.selectTotalUnread);
export const selectNavToConversation = createSelector(
  selectConversationState, fromConversation.selectNavToConversation
);
export const selectPreviousPageConversations = createSelector(
  selectConversationState, fromConversation.selectPreviousPage
);
const selectSelectedConversation = createSelector(
  selectConversationState,
  fromConversation.selectSelected
);

const selectConversationEntities = createSelector(
  selectConversationState,
  fromConversation.selectEntities
);

export const getSelectConversation = createSelector(
selectConversationEntities, selectSelectedConversation, (entities, selectedPk) => entities[selectedPk]);
