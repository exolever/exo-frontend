import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { SharedModule } from '@shared/shared.module';
import { IFilterOption, IFilter } from '@shared/components/filter/filter.component';
import { AppState } from '@core/store/reducers';
import { configTestBed } from '@testing/test.common.spec';
import { DATA } from '@overlay/services/overlay.service';
import { MOCK_DEFAULT_OVERLAY_CONFIG } from '@overlay/services/overlay.service.stub';
import { MockOverlayTemplateComponent } from '@overlay/components/overlay-template.component.mock';
import { OverlayService } from '@overlay/services/overlay.service';
import { OverlayServiceStub } from '@overlay/services/overlay.service.stub';
import { USER_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

import * as fromMediaLibrary from '../../store/reducers';
import * as SearchActions from '../../store/search/search.actions';
import { MediaLibraryWebsocketService } from '../../store/real-time.service';
import { MediaLibraryWebsocketServiceStub } from '../../store/real-time.service.stub';
import { SearchEffects } from '../../store/search/search.effect';
import { ResourcesService } from '../../services/resources.service';
import { ResourcesServiceStub } from '../../services/resources.service.stub';
import { FilterOptionsService } from '../../services/filter.service';
import { FilterOptionsServiceStub } from '../../services/filter.service.stub';
import { MediaFiltersComponent } from './media-filters.component';

describe('MediaFiltersComponent', () => {
  let component: MediaFiltersComponent;
  let fixture: ComponentFixture<MediaFiltersComponent>;
  let store: Store<AppState>;
  let fullscreen: OverlayService;
  let staticFilter: IFilter[];

  const moduleDef: TestModuleMetadata = {
    imports: [
      NoopAnimationsModule,
      TranslateStubModule,
      SharedModule,
      RouterTestingModule,
      EffectsModule.forRoot([SearchEffects]),
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('mediaLibrary', fromMediaLibrary.reducers)
    ],
    declarations: [ MediaFiltersComponent, MockOverlayTemplateComponent ],
    providers: [
      USER_SERVICE_STUB_PROVIDER,
      { provide: DATA, useValue: MOCK_DEFAULT_OVERLAY_CONFIG },
      { provide: FilterOptionsService, useClass: FilterOptionsServiceStub },
      { provide: MediaLibraryWebsocketService, useClass: MediaLibraryWebsocketServiceStub },
      { provide: OverlayService, useClass: OverlayServiceStub },
      { provide: ResourcesService, useClass: ResourcesServiceStub }
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fullscreen = TestBed.get(OverlayService);
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();

    staticFilter = [{
      name: 'status',
      slug: 'status',
      isRadioButton: true,
      dirty: false,
      options: [
        {name: 'All', pk: 'status', selected: true, showByDefault: true},
        {name: 'Pending', pk: 'D', selected: false, showByDefault: true},
        {name: 'Available', pk: 'A', selected: false, showByDefault: true}
      ]
    }];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('enableSearch should work without searchble options', () => {
    const options: IFilterOption[] = [
      {pk: '1', name: 'name1', showByDefault: true},
      {pk: '2', name: 'name2', showByDefault: true},
      {pk: '3', name: 'name3', showByDefault: true}
    ];

    const filter: IFilter = {
      dirty: false,
      name: 'name',
      slug: 'name',
      options: options
    };
    expect(component.enableSearch(filter)).toBeFalsy();
  });

  it('enableSearch should work with searchble options', () => {
    const options: IFilterOption[] = [
      {pk: '1', name: 'name1', showByDefault: true},
      {pk: '2', name: 'name2', showByDefault: true},
      {pk: '3', name: 'name3', showByDefault: false}
    ];

    const filter: IFilter = {
      dirty: false,
      name: 'name',
      slug: 'name',
      options: options
    };
    expect(component.enableSearch(filter)).toBeTruthy();
  });

  it('onCleanFilters should dispatch the action', () => {
    component.onCleanFilters();
    expect(store.dispatch).toHaveBeenCalledWith(new SearchActions.RestoreFilters());
  });

  it('clear should dispatch the action', () => {
    const spy = spyOn(fullscreen, 'close');
    component.clear();
    expect(store.dispatch)
      .toHaveBeenCalledWith(new SearchActions.FiltersSet({filters: staticFilter, forceReset: true}));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('onUpdateFilters should dispatch the action', () => {
    const filter = {
      name: 'myFilter',
      values: []
    };
    component.onUpdateFilters(filter);
    expect(store.dispatch).toHaveBeenCalledWith(new SearchActions.Filter(filter));
  });

});

