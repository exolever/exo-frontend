import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { configTestBed } from '@testing/test.common.spec';
import { pipeDoubleExpectedCallAmount } from '@testing/ngrx/ngrx-helpers';
import { SharedModule } from '@shared/shared.module';
import { OrderEnum } from '@applications/shared/enums';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';

import { OverlayMediaComponent } from '../overlay-media/components/overlay-media.component';
import { OverlayMediaService } from '../overlay-media/services/overlay-media.service';
import { ResourcesService } from '../../services/resources.service';
import { FilterOptionsService } from '../../services/filter.service';
import { FilterOptionsServiceStub } from '../../services/filter.service.stub';
import { ResourcesServiceStub } from '../../services/resources.service.stub';
import { MediaLibraryWebsocketService } from '../../store/real-time.service';
import { MediaLibraryWebsocketServiceStub } from '../../store/real-time.service.stub';
import { SearchEffects } from '../../store/search/search.effect';
import { LIBRARY_CONFIG, mediaLibraryConfig} from '../../ecosystem-media-library.conf';
import { SorterComponent } from './sorter.component';
import * as fromMediaLibrary from '../../store/reducers';
import * as SearchActions from '../../store/search/search.actions';

describe('SorterComponent', () => {
  let component: SorterComponent;
  let fixture: ComponentFixture<SorterComponent>;
  let store;

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      BrowserAnimationsModule,
      TranslateStubModule,
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
    declarations: [
      SorterComponent,
      OverlayMediaComponent,
    ],
    providers: [
      OverlayMediaService,
      { provide: ResourcesService, useClass: ResourcesServiceStub },
      { provide: FilterOptionsService, useClass: FilterOptionsServiceStub },
      { provide: MediaLibraryWebsocketService, useClass: MediaLibraryWebsocketServiceStub },
      { provide: LIBRARY_CONFIG, useValue: mediaLibraryConfig }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(SorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    spyOn(store, 'pipe').and.callThrough();
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hasOrder works with default order', () => {
    expect(component.hasOrder()).toBeFalsy();
  });

  it('should call store to fetch data', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    /** it has three calls but each pipe is called once
     * before any store response, so we must expect double number of calls
     **/
    expect(store.pipe).toHaveBeenCalledTimes(pipeDoubleExpectedCallAmount(3));
  });

  it('hasOrder works with ASC order', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Asc));
    expect(component.hasOrder()).toBeTruthy();
  });

  it('hasOrder works with DESC order', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Desc));
    expect(component.hasOrder()).toBeTruthy();
  });

  it('orderDescending works with ASC order', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Asc));
    expect(component.orderDescending()).toBeFalsy();
  });

  it('orderDescending works with DESC order', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Desc));
    expect(component.orderDescending()).toBeTruthy();
  });

  it('orderAscending works with ASC order', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Asc));
    expect(component.orderAscending()).toBeTruthy();
  });

  it('orderAscending works with DESC order', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Desc));
    expect(component.orderAscending()).toBeFalsy();
  });

  it('onUpdateSortBy generate a new action for sorting', () => {
    const event = {value: 'date'};
    component.onUpdateSortBy(event);
    expect(store.dispatch).toHaveBeenCalledWith(new SearchActions.Sort(event.value));
  });

  it('onChangeOrdering works for ASC -> DESC change', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Asc));
    expect(component.orderAscending()).toBeTruthy();
    component.onChangeOrdering();
    expect(component.orderDescending()).toBeTruthy();
  });

  it('onChangeOrdering works for DESC -> ASC change', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Desc));
    expect(component.orderDescending()).toBeTruthy();
    component.onChangeOrdering();
    expect(component.orderAscending()).toBeTruthy();
  });

});
