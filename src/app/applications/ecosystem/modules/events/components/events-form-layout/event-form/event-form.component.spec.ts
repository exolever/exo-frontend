import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { MapsAPILoader } from '@agm/core';
import { Store, StoreModule } from '@ngrx/store';

import { MapsAPILoaderStub } from '@testing/stubs/maps-api-loader-stub';
import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';
import { configTestBed } from '@testing/test.common.spec';
import { AppState } from '@core/store/reducers';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { SharedModule } from '@shared/shared.module';
import { DATA } from '@overlay/services/overlay.service';
import { MOCK_DEFAULT_OVERLAY_CONFIG } from '@overlay/services/overlay.service.stub';
import { LanguageService } from '@applications/shared/services';
import { StubLanguageService } from '@applications/shared/stubs';
import * as fromEvents from '@ecosystem/modules/events/store/events.reducer';
import { UserService } from '@core/services';
import { UserServiceStub } from '@core/services/stubs';
import { StubConsultantListService } from '@applications/shared/stubs/consultant-list.service-stub';
import { ConsultantListService } from '@applications/shared/services/consultant-list.service';
import {EventFormComponent} from './event-form.component';
import {EventService} from '@ecosystem/modules/events/service/events.service';
import {IntercomService} from '@core/services/intercom/intercom.service';
import {IntercomServiceStub} from '@core/services/intercom/intercom.service.stub';
import {EventsServiceStub} from '@ecosystem/modules/events/service/events.service-stub';
import { FilestackService } from '@core/services/filestack.service';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let store: Store<AppState>;

  const eventsState: fromEvents.EventState = {
    loading: false,
    selectedEventPk: undefined,
    entities: {},
    ids: [],
    selectedAttendeePk: undefined,
    participants: undefined,
    pageIndex: undefined,
    pageSize: undefined,
    count: undefined
  };

  const moduleDef: TestModuleMetadata = {
    declarations: [
      EventFormComponent,
    ],
    imports: [
      NoopAnimationsModule,
      ReactiveFormsModule,
      SharedModule,
      TranslateStubModule,
      CustomMd2DatepickerModule,
      RouterTestingModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('events',
        fromEvents.reducer, { initialState: eventsState }
      )
    ],
    providers: [
      FormBuilder,
      { provide: MapsAPILoader, useClass: MapsAPILoaderStub },
      { provide: EventService, useClass: EventsServiceStub },
      { provide: IntercomService, useClass: IntercomServiceStub },
      { provide: DATA, useValue: MOCK_DEFAULT_OVERLAY_CONFIG },
      { provide: LanguageService, useClass: StubLanguageService },
      { provide: UserService, useClass: UserServiceStub },
      { provide: ConsultantListService, useClass: StubConsultantListService },
      { provide: FilestackService, useValue: { init() {}}},
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit event emit CreateEvent action when is valid', () => {
    component.form.setValue({
      category: 'WO',
      eventImage: '',
      typeEventName: 'Workshop',
      title: 'title',
      start: new Date('1/1/2019'),
      end: new Date('1/12/2019'),
      followType: 'S',
      languages: ['English'],
      placeId: 'placeId',
      url: '',
      showPrice: true,
      location: 'Madrid, Spain',
    });
    component.onSubmit();
    expect(component.isSubmitted).toBeTruthy();
  });

});
