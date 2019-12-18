import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createSelector} from '@ngrx/store';

import {AppState} from '@core/store/reducers';

import {Event, Participant} from './event.model';
import * as fromActions from './events.action';
import * as MomentTZ from 'moment-timezone';
import {RoleMember} from '@ecosystem/modules/events/store/event.enums';

export interface EventState extends EntityState<Event> {
  selectedEventPk: string | undefined;
  loading: boolean;
  pageIndex: number | undefined;
  count: number | undefined;
  pageSize: number | undefined;

  // When it exists a selectedEventPk
  participants: Participant[];
  selectedAttendeePk: number | undefined;
}

const eventAdapter: EntityAdapter<Event> =
  createEntityAdapter<Event>({
    selectId: (ev: Event) => ev.uuid
  });


const initialState: EventState = eventAdapter.getInitialState({
  selectedEventPk: undefined,
  loading: false,
  selectedAttendeePk: undefined,
  participants: undefined,
  pageIndex: undefined,
  count: undefined,
  pageSize: undefined,
});


export function reducer(
  state = initialState, action: fromActions.EventActions | fromActions.WorkshopActions
): EventState {
  switch (action.type) {
    case fromActions.LOAD_EVENTS:
      return {...state,
        loading: true,
        pageSize: action.payload.pageSize,
        pageIndex: action.payload.pageIndex};

    case fromActions.LOAD_EVENTS_SUCCESS:
      return eventAdapter.addAll(<Event[]>action.payload.results, {
        ...state,
        loading: false,
        count: +action.payload.count,
        selectedAttendeePk: undefined,
        selectedEventPk: undefined,
        participants: undefined,
        // count: +action.payload.count,
      });

    case fromActions.LOAD_EVENTS_FAIL:
      return {...state, loading: false};
    case fromActions.ADD_EVENT_SUCCESS:
      return eventAdapter.addOne(action.payload, state);
    case fromActions.DELETE_EVENT_SUCCESS:
      return eventAdapter.removeOne(action.payload.uuid, {...state});
    case fromActions.SELECT_EVENT:
      return {...state, selectedEventPk: action.payload};
    case fromActions.SELECT_EVENT_SUCCESS:
      return eventAdapter.addOne(action.payload, state);
    case fromActions.UPDATE_EVENT_SUCCESS:
      return eventAdapter.upsertOne(action.payload, state);
    case fromActions.SELECT_PARTICIPANT:
      return {...state, selectedAttendeePk: action.payload};
    case fromActions.CREATE_PARTICIPANT_SUCCESS:
      return {
        ...state,
        participants: state.participants ? state.participants.concat(action.payload) : [action.payload]
      };
    case fromActions.UPLOAD_PARTICIPANTS_SUCCESS:
      const currentParticipants = state.participants && state.participants.length > 0 ? state.participants : [];
      return {...state, participants: currentParticipants.concat(action.payload)};
    case fromActions.DELETE_PARTICIPANT_SUCCESS:
      return {...state, participants: state.participants.filter(a => a.uuid !== action.payload.uuid)};
    case fromActions.UPDATE_PARTICIPANT_SUCCESS:
      return {
      ...state,
      participants: state.participants.map(item => item.id === action.payload.id ? action.payload : item)
      };
    case fromActions.SET_CURRENT_EVENT:
      return {...state, selectedEventPk: action.payload};
    case fromActions.LOAD_PARTICIPANTS_SUCCESS:
      return {...state, participants: action.payload};
    default:
      return state;
  }
}
export const selectEventState = createFeatureSelector<EventState>('events');

const selectCount = (state: EventState) => state.count;
const selectPageSize = (state: EventState) => state.pageSize;
const selectPageIndex = (state: EventState) => state.pageIndex;

export const selectCountEvents = createSelector(selectEventState, selectCount);
export const selectPageSizeEvents = createSelector(selectEventState, selectPageSize);
export const selectPageIndexEvents = createSelector(selectEventState, selectPageIndex);


export const getSelectEventSelectedPk = (state: EventState) => state.selectedEventPk;

// tslint:disable-next-line
const {selectEntities, selectAll} = eventAdapter.getSelectors();

export const getAll = createSelector(selectEventState, selectAll);

export const selectEventsEntities = createSelector(
  selectEventState,
  selectEntities
);

export const selectCurrentEventPk = createSelector(
  selectEventState,
  getSelectEventSelectedPk
);

export const getSelectEventUpToDate = (state: EventState): any => {
  return Object.keys(state.entities)
    .filter(id => MomentTZ().isBefore(state.entities[id].end, 'day') ||
      MomentTZ().isSame(state.entities[id].end, 'day'))
    .map(id => state.entities[id]);

};

export const getSelectEventOutOfDate = (state: EventState): any => {
  return Object.keys(state.entities)
    .filter(id => MomentTZ().isAfter(state.entities[id].end, 'day'))
    .map(id => state.entities[id]);

};


export const selectUpToDateEvents = createSelector(
  selectEventState,
  getSelectEventUpToDate
);

export const selectOutOfDateEvents = createSelector(
  selectEventState,
  getSelectEventOutOfDate
);


export const getSelectedEvent = createSelector(
  selectEventsEntities,
  selectCurrentEventPk,
  (eventsEntities, eventPk) => eventsEntities[eventPk]
);


export function isLoading(state: AppState): boolean {
  return state.events.loading;
}

export function loadedWithoutContent(state: AppState): boolean {
  return state.events.loading === false && Object.keys(state.events.entities).length === 0;
}

export function getSelectedParticipant(state: AppState): Participant {
  return state.events.participants.find(a => a.id === state.events.selectedAttendeePk);
}

export function getParticipants(state: AppState): Participant[] {
  return state.events.participants ?
    state.events.participants.filter(p => p.role === RoleMember.PARTICIPANT) :
    [];
}
