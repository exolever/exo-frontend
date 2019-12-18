import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';
import * as EventsActions from '../../store/events.action';
import { configTestBed } from '@testing/test.common.spec';
import { LocalStorageServiceStubProvider, URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';
import { AppState } from '@core/store/reducers';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { EventsListComponent } from '@ecosystem/modules/events/components';
import * as fromEvents from '@ecosystem/modules/events/store/events.reducer';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let store: Store<AppState>;

  const initialState: fromEvents.EventState = {
    loading: false,
    selectedEventPk: undefined,
    entities: {},
    ids: [],
    selectedAttendeePk: undefined,
    pageIndex: undefined,
    pageSize: undefined,
    count: undefined,
    participants: undefined

  };
  const moduleDef: TestModuleMetadata = {
    declarations: [EventsListComponent],
    imports: [
      TestingUtilityModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('events',
        fromEvents.reducer, {initialState: initialState}
      )
    ],
    providers: [
      URL_SERVICE_STUB_PROVIDER,
      LocalStorageServiceStubProvider,
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.stub();
    spyOn(store, 'select').and.stub();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should get the events from store', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new EventsActions.LoadEvents({pageIndex: 1, pageSize: 15}));
  });

  it('Should toggle loading', () => {
    const action = new EventsActions.LoadEvents({pageIndex: 0, pageSize: 15});
    store.dispatch(action);
    component.loading$.subscribe((res) => {
      expect(res).toBeTruthy();
    });
  });
});
