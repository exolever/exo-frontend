import { EventService } from '@ecosystem/modules/events/service/events.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UrlService } from '@app/core';
import { Event } from '@ecosystem/modules/events/store/event.model';
import { RoleMember, StatusTypeEnum } from '@ecosystem/modules/events/store/event.enums';
import { UserStatus } from '@core/enums';

describe('EventsService', () => {
  let service: EventService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        UrlService,
      ],
      imports: [
        HttpClientTestingModule,
      ],
    });

    service = TestBed.get(EventService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return all events', () => {
    service.getEvents({pageIndex: 0, pageSize: 15})
      .subscribe(res => expect(res.results).toEqual([], 'Return all events'));

    const req = httpTestingController.expectOne(
      (request) => RegExp('events/api/event/', 'i').test(request.url));

    expect(req.request.method).toEqual('GET');
    req.flush([]);
    httpTestingController.verify();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should return an event', () => {
    const event = new Event({ pk: '1' });
    service.getEvent('uiid2312')
      .subscribe(e => expect(e).toEqual(event, 'Return an event'));

    const req = httpTestingController.expectOne(
      (request) => RegExp('event/uiid2312/', 'i').test(request.url));

    expect(req.request.method).toEqual('GET');
    req.flush(event);
    httpTestingController.verify();
  });

  it('Should add an event', () => {
    const event = new Event({ pk: '1', title: 'test', url: 'url' });
    service.addEvent({title: 'test', url: 'url', pk: '1'})
      .subscribe(e => expect(e).toEqual(event, 'Add an event'));

    const req = httpTestingController.expectOne(
      (request) => RegExp('event/', 'i').test(request.url));

    expect(req.request.method).toEqual('POST');
    req.flush(event);
    httpTestingController.verify();
  });

  it('Should update an event', () => {
    const event = new Event({ pk: '2', title: 'testUpdated', url: 'urlUpdated' });
    service.updateEvent('uuidTest', { pk: '2', title: 'testUpdated', url: 'urlUpdated' })
      .subscribe(e => expect(e).toEqual(event, 'Update an event'));

    const req = httpTestingController.expectOne(
      (request) => RegExp('event/uuidTest', 'i').test(request.url));

    expect(req.request.method).toEqual('PUT');
    req.flush(event);
    httpTestingController.verify();
  });

  it('Should delete an event', () => {
    const event = new Event({ pk: '1', title: 'test', url: 'url', status: StatusTypeEnum.DELETED, uuid: 'uuidTest' });
    service.deleteEvent('uuidTest')
      .subscribe(e => expect(e).toEqual(event, 'Deleted event'));

    const req = httpTestingController.expectOne(
      (request) => RegExp('event/uuidTest', 'i').test(request.url));

    expect(req.request.method).toEqual('PUT');
    req.flush(event);
    httpTestingController.verify();
  });

  it('Should return event permission type', () => {
    service.getPermissionsEvent()
      .subscribe(e => expect(e).toEqual([], 'Event permission type'));

    const req = httpTestingController.expectOne(
      (request) => RegExp('event/events_types/', 'i').test(request.url));

    expect(req.request.method).toEqual('GET');
    req.flush([]);
    httpTestingController.verify();
  });

  it('Should return participants', () => {
    service.getParticipants('1')
      .subscribe(e => expect(e).toEqual([]));

    const req = httpTestingController.expectOne(
      (request) => RegExp('event/participants/1/', 'i').test(request.url));

    expect(req.request.method).toEqual('GET');
    req.flush([]);
    httpTestingController.verify();
  });

  it('Should create a participant', () => {
    const participant = {
      uuid: 'uuidParticipant',
      role: RoleMember.SPEAKER_SUMMIT,
      roleName: 'speaker',
      status: UserStatus.CH_ACTIVE,
    };

    service.createParticipant('1', participant)
      .subscribe(e => expect(e).toEqual(participant));

    const req = httpTestingController.expectOne(
      (request) => RegExp('event/participants/1/', 'i').test(request.url));

    expect(req.request.method).toEqual('POST');
    req.flush(participant);
    httpTestingController.verify();
  });
});
