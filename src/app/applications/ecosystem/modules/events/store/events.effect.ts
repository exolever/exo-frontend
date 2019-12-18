import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY as empty, Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';

import { UrlService, Urls } from '@core/services';
import { EventService } from '../service/events.service';
import * as fromActions from './events.action';
import * as fromEvents from './events.reducer';
import { Event, Participant } from './event.model';
// import { PaginationModel } from '@applications/shared/models';


@Injectable()
export class EventsEffect {
  closeLabel: string;

  @Effect()
  loading$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOAD_EVENTS),
    switchMap((action: fromActions.LoadEvents) => this.eventsService.getEvents(action.payload).pipe(
      map((response: any) => new fromActions.LoadEventsSuccess(response)),
      catchError(error => this.showError('LOADING_EVENT_FAIL', new fromActions.LoadEventsFail(error)))
    )),
  );

  @Effect()
  creating$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.ADD_EVENT),
    switchMap((action: fromActions.AddEventSuccess) => this.eventsService.addEvent(action.payload).pipe(
      map((ev: Event) => {
        this.snackBar.open(this.translate.instant('ECOSYSTEM.EVENTS.TOAST.ADD_EVENT_SUCCESS'), this.closeLabel);
        const url = this.urlService.getPath([Urls.ECOSYSTEM_EVENTS_LIST]);
        this.router.navigate([url]);
        return new fromActions.AddEventSuccess(ev);
      }),
      catchError(error => this.showError('ADD_EVENT_FAIL', new fromActions.AddEventFail(error)))
    )),
  );

  @Effect()
  selecting$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SELECT_EVENT),
    switchMap((action: fromActions.SelectEvent) => this.eventsService.getEvent(action.payload).pipe(
      map((ev: Event) => new fromActions.SelectEventSuccess(ev)),
      catchError(error => this.showError('SELECT_EVENT_FAIL', new fromActions.SelectEventFail(error)))
    )),
  );

  @Effect()
  updating$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.UPDATE_EVENT),
    switchMap((action: fromActions.UpdateEvent) =>
      this.eventsService.updateEvent(action.payload.uuid, action.payload.data).pipe(
        map((ev: Event) => {
          this.snackBar.open(this.translate.instant('ECOSYSTEM.EVENTS.TOAST.UPDATE_EVENT_SUCCESS'), this.closeLabel);
          return new fromActions.UpdateEventSuccess(ev);
        }),
        catchError(error => this.showError('UPDATE_EVENT_FAIL', new fromActions.UpdateEventFail(error)))
      )
    ),
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.DELETE_EVENT),
    switchMap((action: fromActions.DeleteEvent) => this.eventsService.deleteEvent(action.payload.uuid).pipe(
      map((ev: Event) => {
        this.snackBar.open(this.translate.instant('ECOSYSTEM.EVENTS.TOAST.DELETE_EVENT_SUCCESS'), this.closeLabel);
        return new fromActions.DeleteEventSuccess(ev);
      }),
      catchError(error => this.showError('DELETE_EVENT_FAIL', new fromActions.DeleteEventFail(error)))
    )),
  );

  @Effect()
  getParticipants$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOAD_PARTICIPANTS),
    switchMap((action: fromActions.LoadParticipants) => this.eventsService.getParticipants(action.payload).pipe(
      map(response => new fromActions.LoadParticipantsSuccess(response)),
      catchError(error => this.showError('GET_PARTICIPANTS_FAIL', new fromActions.LoadParticipantsFail(error)))
    )),
  );

  @Effect()
  uploadFileAttendees$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.UPLOAD_PARTICIPANTS),
    switchMap((action: fromActions.UploadParticipantsFile) =>
      this.eventsService.uploadFileAttendees(action.payload.uuid, action.payload.data).pipe(
        map(response => {
          this.snackBar.open(this.translate.instant('ECOSYSTEM.WORKSHOPS.TOAST.UPLOAD_PARTICIPANTS_SUCCESS'),
            this.closeLabel);
          return new fromActions.UploadParticipantsFileSuccess(response);
        }),
        catchError(error => this.showError('UPLOAD_PARTICIPANTS_FAIL'))
      )
    ),
  );

  @Effect()
  deletingParticipant$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.DELETE_PARTICIPANT),
    withLatestFrom(this.store.pipe(select(fromEvents.getSelectedEvent))),
    switchMap((value: [fromActions.DeleteParticipant, Event], index: number) => {
      return this.eventsService.deleteParticipant(value[1].uuid, value[0].payload.id).pipe(
        map(r => value[0].payload),
        map((attendee: Participant) => {
          this.snackBar.open(this.translate.instant('ECOSYSTEM.WORKSHOPS.TOAST.DELETE_PARTICIPANT_SUCCESS'),
            this.closeLabel);
          return new fromActions.DeleteParticipantSuccess(attendee);
        }),
        catchError(error => this.showError('DELETE_PARTICIPANT_FAIL'))
      );
    }),
  );

  @Effect()
  updatingParticipant$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.UPDATE_PARTICIPANT),
    withLatestFrom(this.store.pipe(select(fromEvents.getSelectedEvent))),
    switchMap((value: [fromActions.UpdateParticipant, any], index: number) => {
      return this.eventsService.updateParticipant(
        value[1].uuid, value[0].payload.id, value[0].payload).pipe(
          map(r => value[0].payload),
          map((attendee: Participant) => {
            this.snackBar.open(this.translate.instant('ECOSYSTEM.WORKSHOPS.TOAST.UPDATE_PARTICIPANTS_SUCCESS'),
              this.closeLabel);
            return new fromActions.UpdateParticipantSuccess(attendee);
          }),
          catchError(error => this.showError('UPDATE_PARTICIPANT_FAIL'))
        );
    }),
  );

  @Effect()
  creatingParticipant$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.CREATE_PARTICIPANT),
    withLatestFrom(this.store.pipe(select(fromEvents.selectCurrentEventPk))),
    switchMap((value: any, index: number) =>
      this.eventsService.createParticipant(value[1], value[0].payload).pipe(
        map((attendee: Participant) => {
          this.snackBar.open(this.translate.instant('ECOSYSTEM.WORKSHOPS.TOAST.CREATE_PARTICIPANTS_SUCCESS'),
            this.closeLabel);
          return new fromActions.CreateParticipantSuccess(attendee);
        }),
        catchError(error => this.showError('CREATE_PARTICIPANT_FAIL'))
      )
    ),
  );

  @Effect()
  sendCertificates$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.CERTIFICATES_SEND),
    withLatestFrom(this.store.pipe(select(fromEvents.getSelectedEvent))),
    switchMap((value: [fromActions.SendCertificates, any], index: number) =>
      this.eventsService.sendAllCertificates(value[1].uuid).pipe(
        map(() => {
          this.snackBar.open(
            this.translate.instant('ECOSYSTEM.WORKSHOPS.TOAST.SEND_CERTIFICATES_SUCCESS'), this.closeLabel);
          return new fromActions.SendCertificatesSuccess();
        }),
        catchError(error => this.showError('SEND_CERTIFICATES_FAIL'))
      )
    ),
  );

  @Effect()
  sendOneCertificate$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.CERTIFICATE_SEND),
    withLatestFrom(this.store.pipe(select(fromEvents.getSelectedEvent))),
    switchMap((value: [fromActions.SendOneCertificate, any], index: number) =>
      this.eventsService.sendCertificateToAttendee(value[1].uuid, value[0].payload.id).pipe(
        map(() => {
          this.snackBar.open(
            this.translate.instant('ECOSYSTEM.WORKSHOPS.TOAST.CERTIFICATE_PARTICIPANT_SUCCESS'), this.closeLabel);
          return new fromActions.SendOneCertificateSuccess();
        }),
        catchError(error => this.showError('CERTIFICATE_PARTICIPANT_FAIL'))
      )
    ),
  );

  constructor(
    private actions$: Actions,
    private eventsService: EventService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private urlService: UrlService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.closeLabel = this.translate.instant('NOTIFICATION.CLOSE');
  }

  private showError(messageKey, error?) {
    this.snackBar.open(this.translate.instant('ECOSYSTEM.WORKSHOPS.TOAST.' + messageKey), this.closeLabel);
    return error ? observableOf(new fromActions.LoadEventsFail(error)) : empty;
  }
}
