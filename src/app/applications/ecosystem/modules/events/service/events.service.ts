import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiResources, UrlService } from '@core/services/api/resolve';
import { Event, EventPermissionType, Participant } from '../store/event.model';
import { RoleMember, StatusTypeEnum } from '@ecosystem/modules/events/store/event.enums';
import { Pagination } from '@core/interfaces/pagination.interface';

@Injectable()
export class EventService {
  constructor(
    private httpClient: HttpClient,
    private urlService: UrlService
  ) {
  }

  getEvents(pagination: {pageIndex: number, pageSize: number}): Observable<Pagination<Event>> {
    let apiUrl = this.urlService.resolveEvents(ApiResources.EVENTS);
    apiUrl = this.urlService.resolveGetParams(
      apiUrl, ['page', 'page_size'], [`${pagination.pageIndex}`, `${pagination.pageSize}`]);
    return this.httpClient.get<Pagination<Event>>(apiUrl).pipe(
      tap((response: Pagination<Event>) => response.results = response.results.map(ev => new Event(ev)))
    );
  }

  getEvent(uuid: string): Observable<Event> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_BY_UUID, uuid);
    return this.httpClient.get<Event>(apiUrl).pipe(map(response => new Event(response)));
  }

  getEventFromReviewer(uuid: string): Observable<Event> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_BY_UUID_REVIEW, uuid);
    return this.httpClient.get<Event>(apiUrl).pipe(map(response => new Event(response)));
  }

  addEvent(data): Observable<Event> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENTS);
    return this.httpClient.post(apiUrl, data).pipe(
      map((response: any) => new Event(response))
    );
  }

  updateEvent(uuid: string, data): Observable<Event> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_BY_UUID, uuid);
    return this.httpClient.put(apiUrl, data).pipe(
      map((response: any) => new Event(response))
    );
  }

  publishEvent(uuid: string, data): Observable<Event> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_REVIEW_PUBLISH, uuid);
    return this.httpClient.put(apiUrl, data).pipe(
      map((response: any) => new Event(response))
    );
  }

  rejectEvent(uuid: string, data): Observable<Event> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_REVIEW_REJECT, uuid);
    return this.httpClient.put(apiUrl, data).pipe(
      map((response: any) => new Event(response))
    );
  }

  deleteEvent(uuid: string): Observable<Event> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_CHANGE_STATUS, uuid);
    return this.httpClient.put(apiUrl, { status: StatusTypeEnum.DELETED }).pipe(
      map((response: any) => new Event({ uuid, ...response }))
    );
  }

  getPermissionsEvent(): Observable<EventPermissionType[]> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENTS_GET_TYPES);
    return this.httpClient.get<EventPermissionType[]>(apiUrl);
  }

  getParticipants(pkEvent: string): Observable<Participant[]> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_PARTICIPANTS, pkEvent);
    return this.httpClient.get<Participant[]>(apiUrl);
  }

  createParticipant(pkEvent: string, data): Observable<Participant> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_PARTICIPANTS, pkEvent);
    return this.httpClient.post<Participant>(apiUrl, data);
  }

  updateParticipant(pkEvent: string, pkAttendee: number, data: any): Observable<any> {
    const apiUrl = this.urlService.resolveEvents(
      ApiResources.EVENT_PARTICIPANTS_DELETE, pkEvent, pkAttendee.toString()
    );
    return this.httpClient.put(apiUrl, data);
  }

  deleteParticipant(pkEvent: string, pkAttendee: number): Observable<any> {
    const apiUrl =
      this.urlService.resolveEvents(ApiResources.EVENT_PARTICIPANTS_DELETE, pkEvent, pkAttendee.toString());
    return this.httpClient.delete(apiUrl);
  }

  uploadFileAttendees(uuid: string, data): Observable<Participant[]> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_ATTENDEES_FILE_UPLOAD, uuid);
    return this.httpClient.post<Participant[]>(apiUrl, { content: data, role: RoleMember.PARTICIPANT });
  }

  sendCertificateToAttendee(eventId: string, pkConsultant: number): Observable<any> {
    const apiUrl =
      this.urlService.resolveEvents(ApiResources.EVENT_ATTENDEE_CERTIFICATE, eventId, pkConsultant.toString());
    return this.httpClient.post(apiUrl, {});
  }

  sendAllCertificates(eventId: string): Observable<any> {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_ATTENDEES_CERTIFICATE, eventId);
    return this.httpClient.post(apiUrl, {});
  }


  sendEmail(data: { comment: any }) {
    const apiUrl = this.urlService.resolveEvents(ApiResources.EVENT_REQUEST_SUMMIT);
    return this.httpClient.post(apiUrl, data);
  }
}
