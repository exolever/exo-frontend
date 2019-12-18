import {Event, Participant} from './event.model';
import {Action} from '@ngrx/store';
import { Pagination } from '@core/interfaces/pagination.interface';

export const LOAD_EVENTS = '[Events] Load events';
export const LOAD_EVENTS_SUCCESS = '[Events] Load events SUCCESS';
export const LOAD_EVENTS_FAIL = '[Events] Load events FAIL';
export const ADD_EVENT = '[Events] Add new event';
export const ADD_EVENT_SUCCESS = '[Events] Add new event SUCCESS';
export const ADD_EVENT_FAIL = '[Events] Add new event FAIL';
export const UPDATE_EVENT = '[Events] Update new event';
export const UPDATE_EVENT_SUCCESS = '[Events] Update new event SUCCESS';
export const UPDATE_EVENT_FAIL = '[Events] Update new event FAIL';
export const DELETE_EVENT = '[Events] Delete event';
export const DELETE_EVENT_SUCCESS = '[Events] Delete event SUCCESS';
export const DELETE_EVENT_FAIL = '[Events] Delete event FAIL';
export const SELECT_EVENT = '[Events] Select event';
export const SELECT_EVENT_SUCCESS = '[Events] Select event SUCCESS';
export const SELECT_EVENT_FAIL = '[Events] Select event FAIL';
export const SET_CURRENT_EVENT = '[Events] Set current event';
export const LOAD_PARTICIPANTS = '[Events] Load participants';
export const LOAD_PARTICIPANTS_SUCCESS = '[Events] Load participants success';
export const LOAD_PARTICIPANTS_FAIL = '[Events] Load participants fail';
export const UPLOAD_PARTICIPANTS = '[Events] Upload participants file';
export const UPLOAD_PARTICIPANTS_SUCCESS = '[Events] Upload participants file SUCCESS';
export const DELETE_PARTICIPANT = '[Events] Delete participant';
export const DELETE_PARTICIPANT_SUCCESS = '[Events] Delete participant SUCCESS';


// Specific for WS
export const SELECT_PARTICIPANT = '[Workshops - Participant - Select] Select attendee';
export const CREATE_PARTICIPANT = '[Workshops - Participant - Create] Create participant';
export const CREATE_PARTICIPANT_SUCCESS = '[Workshops - Participant - Create] Create participant SUCCESS';
export const UPDATE_PARTICIPANT = '[Workshops - Participant - Update] Update participant';
export const UPDATE_PARTICIPANT_SUCCESS = '[Workshops - Participant - Update] Update participant SUCCESS';
export const CERTIFICATE_SEND = '[Workshops - Attendees - Send certificate] Send certificate';
export const CERTIFICATE_SEND_SUCCESS = '[Workshops - Attendees - Send certificate] Send certificate SUCCESS';
export const CERTIFICATES_SEND = '[Workshops - Attendees - Send certificates] Send ALL certificate';
export const CERTIFICATES_SEND_SUCCESS = '[Workshops - Attendees - Send certificates] Send ALL certificate SUCCESS';

export class LoadEvents implements Action {
  readonly type = LOAD_EVENTS;
  constructor(public payload: {pageIndex: number, pageSize: number}) {}
}

export class LoadEventsSuccess implements Action {
  readonly type = LOAD_EVENTS_SUCCESS;

  constructor(public payload: Pagination<Event>) {
  }
}

export class LoadEventsFail implements Action {
  readonly type = LOAD_EVENTS_FAIL;

  constructor(public payload: any) {
  }
}

export class AddEvent implements Action {
  readonly type = ADD_EVENT;

  constructor(public payload: any) {
  }
}

export class AddEventSuccess implements Action {
  readonly type = ADD_EVENT_SUCCESS;

  constructor(public payload: Event) {
  }
}

export class AddEventFail implements Action {
  readonly type = ADD_EVENT_FAIL;

  constructor(public payload: any) {
  }
}

export class UpdateEvent implements Action {
  readonly type = UPDATE_EVENT;

  constructor(public payload: { uuid: string, data: any }) {
  }
}

export class UpdateEventSuccess implements Action {
  readonly type = UPDATE_EVENT_SUCCESS;

  constructor(public payload: Event) {
  }
}

export class UpdateEventFail implements Action {
  readonly type = UPDATE_EVENT_FAIL;

  constructor(public payload: any) {
  }
}

export class DeleteEvent implements Action {
  readonly type = DELETE_EVENT;

  constructor(public payload: { uuid: string }) {
  }
}

export class DeleteEventSuccess implements Action {
  readonly type = DELETE_EVENT_SUCCESS;

  constructor(public payload: { uuid: string }) {
  }
}

export class DeleteEventFail implements Action {
  readonly type = DELETE_EVENT_FAIL;

  constructor(public payload: any) {
  }
}

export class SelectEvent implements Action {
  readonly type = SELECT_EVENT;

  constructor(public payload: string) {
  }
}

export class SelectEventSuccess implements Action {
  readonly type = SELECT_EVENT_SUCCESS;

  constructor(public payload: Event) {
  }
}

export class SelectEventFail implements Action {
  readonly type = SELECT_EVENT_FAIL;

  constructor(public payload: any) {
  }
}

export class LoadParticipants implements Action {
  readonly type = LOAD_PARTICIPANTS;

  constructor(public payload: string) {
  }
}

export class LoadParticipantsSuccess implements Action {
  readonly type = LOAD_PARTICIPANTS_SUCCESS;

  constructor(public payload: Participant[]) {
  }
}

export class LoadParticipantsFail implements Action {
  readonly type = LOAD_PARTICIPANTS_FAIL;

  constructor(public payload: any) {
  }
}

export class UploadParticipants implements Action {
  readonly type = UPLOAD_PARTICIPANTS;

  constructor(public payload: any) {
  }
}

export class UploadParticipantsSuccess implements Action {
  readonly type = UPLOAD_PARTICIPANTS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class DeleteParticipant implements Action {
  readonly type = DELETE_PARTICIPANT;

  constructor(public payload: Participant) {
  }
}

export class DeleteParticipantSuccess implements Action {
  readonly type = DELETE_PARTICIPANT_SUCCESS;

  constructor(public payload: Participant) {
  }
}

// Specific for WS

export class SelectParticipant implements Action {
  readonly type = SELECT_PARTICIPANT;

  constructor(public payload: number | undefined) {
  }
}

export class UploadParticipantsFile implements Action {
  readonly type = UPLOAD_PARTICIPANTS;

  constructor(public payload: { uuid: string, data: any }) {
  }
}

export class UploadParticipantsFileSuccess implements Action {
  readonly type = UPLOAD_PARTICIPANTS_SUCCESS;

  constructor(public payload: Participant[]) {
  }
}

export class CreateParticipant implements Action {
  readonly type = CREATE_PARTICIPANT;

  constructor(public payload: Participant) {
  }
}

export class UpdateParticipant implements Action {
  readonly type = UPDATE_PARTICIPANT;

  constructor(public payload: Participant) {
  }
}

export class UpdateParticipantSuccess implements Action {
  readonly type = UPDATE_PARTICIPANT_SUCCESS;

  constructor(public payload: Participant) {
  }
}

export class CreateParticipantSuccess implements Action {
  readonly type = CREATE_PARTICIPANT_SUCCESS;

  constructor(public payload: Participant) {
  }
}

export class SendCertificates implements Action {
  readonly type = CERTIFICATES_SEND;
}

export class SendCertificatesSuccess implements Action {
  readonly type = CERTIFICATES_SEND_SUCCESS;
}

export class SendOneCertificate implements Action {
  readonly type = CERTIFICATE_SEND;

  constructor(public payload: Participant) {
  }
}

export class SendOneCertificateSuccess implements Action {
  readonly type = CERTIFICATE_SEND_SUCCESS;
}

export class SetCurrentEvent implements Action {
  readonly type = SET_CURRENT_EVENT;

  constructor(public payload: string) {
  }
}

export type EventActions =
  | LoadEvents
  | LoadEventsSuccess
  | LoadEventsFail
  | AddEvent
  | AddEventSuccess
  | AddEventFail
  | SelectEvent
  | SelectEventSuccess
  | SelectEventFail
  | UpdateEvent
  | UpdateEventSuccess
  | UpdateEventFail
  | DeleteEvent
  | DeleteEventSuccess
  | DeleteEventFail
  | SetCurrentEvent
  | LoadParticipants
  | LoadParticipantsSuccess
  | LoadParticipantsFail
  | UploadParticipants
  | UploadParticipantsSuccess
  | DeleteParticipant
  | DeleteParticipantSuccess;

export type WorkshopActions =
  | SelectParticipant
  | SendCertificates
  | SendCertificatesSuccess
  | SendOneCertificate
  | SendOneCertificateSuccess
  | CreateParticipant
  | UpdateParticipantSuccess
  | UpdateParticipant
  | CreateParticipantSuccess;
