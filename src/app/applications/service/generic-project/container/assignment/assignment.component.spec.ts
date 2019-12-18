/*import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@shared/shared.module';
import { OrderEnum } from '@applications/shared/enums';
import { TranslateStubModule } from '@testing/translate-stub.module'
import { configTestBed } from '@testing/test.common.spec';

import { FormatDurationTimePipe } from '../../pipes/duration.pipe';
import { OverlayComponent } from '../overlay/components/overlay.component';
import { OverlayService } from '../overlay/services/overlay.service';
import { SearchService } from '../../services/search.service';
import { FilterOptionsService } from '../../services/filter.service';
import { FilterOptionsServiceStub } from '../../services/filter.service.stub';
import { SearchServiceStub } from '../../services/search.service.stub';
import * as fromMediaLibrary from '../../store/reducers';
import * as SearchActions from '../../store/search/search.actions';
import { SearchEffects } from '../../store/search/search.effect';
import { LIBRARY_CONFIG, mediaLibraryConfig} from '../../media-library.conf';
import { SorterComponent } from './sorter.component';

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
      StoreModule.forRoot({'mediaLibrary': combineReducers(fromMediaLibrary.reducers.mediaLibrary)})
    ],
    declarations: [
      SorterComponent,
      OverlayComponent,
      FormatDurationTimePipe
    ],
    providers: [
      { provide: SearchService, useClass: SearchServiceStub },
      { provide: FilterOptionsService, useClass: FilterOptionsServiceStub },
      OverlayService,
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
    spyOn(store, 'select').and.callThrough();
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(store.select).toHaveBeenCalledTimes(2);
  });

  it('hasOrder works with default order', () => {
    expect(component.hasOrder()).toBeFalsy();
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
    expect(store.dispatch).toHaveBeenCalledWith(new SearchActions.Sort(event.value))
  });

  it('onChangeOrdering works for ASC -> DESC change', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Asc));
    expect(component.orderAscending()).toBeTruthy();
    component.onChangeOrdering({});
    expect(component.orderDescending()).toBeTruthy();
  });

  it('onChangeOrdering works for DESC -> ASC change', () => {
    store.dispatch(new SearchActions.Order(OrderEnum.Desc));
    expect(component.orderDescending()).toBeTruthy();
    component.onChangeOrdering({});
    expect(component.orderAscending()).toBeTruthy();
  });

});
*/
