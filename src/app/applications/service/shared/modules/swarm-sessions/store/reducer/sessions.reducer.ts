import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import * as SessionsActions from '../action/sessions.action';
import { SessionsState } from './sessions.reducer';
import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';


export interface SessionsState extends EntityState<SwarmSession> {
  loading: boolean;
  loaded: boolean;
  pkSessionSelected: number;
  connectedUsers: Array<string>;
}

const sessionsAdapter: EntityAdapter<SwarmSession> = createEntityAdapter<SwarmSession>({
  selectId: (session: SwarmSession) => session.pk,
  sortComparer: (a: SwarmSession, b: SwarmSession) => a.startAt.isSameOrBefore(b.startAt) ? -1 : 1
});


const initialState: SessionsState = sessionsAdapter.getInitialState({
  loading: false,
  loaded: false,
  pkSessionSelected: undefined,
  connectedUsers: []
});


export function reducer(state: SessionsState = initialState, action: SessionsActions.All): SessionsState {
  switch (action.type) {
    case SessionsActions.TypeActionEnum.LOAD_SESIONS:
      return {...state,
        loading: true,
        loaded: false
      };

    case SessionsActions.TypeActionEnum.LOAD_SESIONS_SUCCESS:
      return sessionsAdapter.addAll(<SwarmSession[]>action.payload, {
        ... state,
        loading: false,
        loaded: true
      });

    case SessionsActions.TypeActionEnum.ADD_ADIVSORS_SUCCESS:
      return sessionsAdapter.upsertOne(
        Object.assign(state.entities[action.payload.pkSession], {advisors: action.payload.advisors}),
        state
      );

    case SessionsActions.TypeActionEnum.SELECT_SESSION:
      return {... state, pkSessionSelected: action.payload.pkSession };

    case SessionsActions.TypeActionEnum.ADD_USERS_SUCCESS:
      return {... state, connectedUsers: [].concat(action.payload) };

    case SessionsActions.TypeActionEnum.ADD_USER:
      state.connectedUsers.push(action.payload);
      return {... state, connectedUsers: [].concat(state.connectedUsers) };

    case SessionsActions.TypeActionEnum.REMOVE_USER:
      const index = state.connectedUsers.indexOf(action.payload);
      state.connectedUsers.splice(index, 1);
      return {... state, connectedUsers: [].concat(state.connectedUsers) };

    default:
      return state;
  }
}

// get the selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = sessionsAdapter.getSelectors();

export const selectLoading = (state: SessionsState) => state.loading;
export const selectLoaded = (state: SessionsState) => state.loaded;
export const selectPkSelected = (state: SessionsState) => state.pkSessionSelected;
export const selectConnectedUsers = (state: SessionsState) => state.connectedUsers;
