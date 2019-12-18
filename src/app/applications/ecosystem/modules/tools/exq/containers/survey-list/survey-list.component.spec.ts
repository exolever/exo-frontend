// import {ComponentFixture, TestBed, TestModuleMetadata} from '@angular/core/testing';
// import {NO_ERRORS_SCHEMA} from '@angular/core';
// import * as MomentTZ from 'moment-timezone';
//
// import {Store, StoreModule} from '@ngrx/store';
// import * as EventsActions from '../../store/events.action';
// import {configTestBed} from '@testing/test.common.spec';
// import {LocalStorageServiceStubProvider, URL_SERVICE_STUB_PROVIDER} from '@core/services/stubs';
// import {AppState} from '@core/store/reducers';
// import {TestingUtilityModule} from '@testing/modules/testing-utility.module';
// import {EventsListComponent} from '@ecosystem/modules/events/components';
// import * as fromEvents from '@ecosystem/modules/events/store/events.reducer';
// import {Event} from '@ecosystem/modules/events/store/event.model';
// import {TypeEventEnum} from '@ecosystem/modules/events/store/event.enums';
//
// describe('EventsListComponent', () => {
//   let component: EventsListComponent;
//   let fixture: ComponentFixture<EventsListComponent>;
//   let store: Store<AppState>;
//
//   const initialState: fromEvents.EventState = {
//     loading: false,
//     selectedEventPk: undefined,
//     website: undefined,
//     entities: {},
//     ids: [],
//     attendees: undefined,
//     selectedAttendeePk: undefined,
//     speakers: undefined,
//     participants: undefined
//
//   };
//   const ev1: Event = {
//     pk: '1',
//     title: 'title',
//     typeEvent: TypeEventEnum.BOOK,
//     start: MomentTZ('2017-03-14 17:00:00'),
//     end: MomentTZ('2017-05-14 17:00:00'),
//     uuid: '1',
//   };
//
//   const moduleDef: TestModuleMetadata = {
//     declarations: [EventsListComponent],
//     imports: [
//       TestingUtilityModule,
//       StoreModule.forRoot({}),
//       StoreModule.forFeature('events',
//         fromEvents.reducer, {initialState: initialState}
//       )
//     ],
//     providers: [
//       URL_SERVICE_STUB_PROVIDER,
//       LocalStorageServiceStubProvider,
//     ],
//     schemas: [NO_ERRORS_SCHEMA]
//   };
//
//   configTestBed(moduleDef);
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(EventsListComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//
//     store = TestBed.get(Store);
//     spyOn(store, 'dispatch').and.stub();
//     spyOn(store, 'select').and.stub();
//   });
//
//   it('Should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('Should get the events from store', () => {
//     component.ngOnInit();
//     fixture.detectChanges();
//
//     expect(store.dispatch).toHaveBeenCalledTimes(1);
//     expect(store.dispatch).toHaveBeenCalledWith(new EventsActions.LoadEvents());
//   });
//
//   it('Should display an out to date event', () => {
//     const action = new EventsActions.AddEventSuccess(ev1);
//
//     store.dispatch(action);
//     component.outEvents$.subscribe(data => {
//       expect(data.length).toBe(0);
//     });
//   });
//
//   it('Should toggle loading', () => {
//     const action = new EventsActions.LoadEvents();
//     store.dispatch(action);
//     component.loading$.subscribe((res) => {
//       expect(res).toBeTruthy();
//     });
//   });
// });
