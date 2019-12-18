import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { EffectsModule} from '@ngrx/effects';

import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';
import { AppState } from '@core/store/reducers';

import * as fromMediaLibrary from '../../store/reducers';
import * as SearchActions from '../../store/search/search.actions';
import { MediaLibraryWebsocketService } from '../../store/real-time.service';
import { MediaLibraryWebsocketServiceStub } from '../../store/real-time.service.stub';
import { SearchEffects } from '../../store/search/search.effect';
import { ResourcesService } from '../../services/resources.service';
import { ResourcesServiceStub } from '../../services/resources.service.stub';
import { FilterOptionsService } from '../../services/filter.service';
import { FilterOptionsServiceStub } from '../../services/filter.service.stub';
import { MediaGridComponent } from './media-grid.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('MediaGridComponent', () => {
  let component: MediaGridComponent;
  let fixture: ComponentFixture<MediaGridComponent>;
  let store: Store<AppState>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      BrowserAnimationsModule,
      TranslateStubModule,
      EffectsModule.forRoot([SearchEffects]),
      StoreModule.forRoot({'mediaLibrary': combineReducers(fromMediaLibrary.reducers)}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      RouterTestingModule
    ],
    declarations: [
      MediaGridComponent
    ],
    providers: [
      { provide: ResourcesService, useClass: ResourcesServiceStub },
      { provide: FilterOptionsService, useClass: FilterOptionsServiceStub },
      { provide: MediaLibraryWebsocketService, useClass: MediaLibraryWebsocketServiceStub }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith(new SearchActions.Search());
  });

  it('should dispatch an action when you paginate', () => {
    component.changePage({pageIndex: 0, pageSize: '12'});
    expect(store.dispatch).toHaveBeenCalledWith(new SearchActions.Paginate({pageIndex: '1', pageSize: '12'}));
  });

});
