import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, TestModuleMetadata } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { AppState } from '@core/store/reducers';
import { configTestBed } from '@testing/test.common.spec';

import * as fromMediaLibrary from '../../store/reducers';
import * as SearchActions from '../../store/search/search.actions';
import { SearchComponent } from './search.component';
import { OverlayService } from '@overlay/services/overlay.service';
import { OverlayServiceStub } from '@overlay/services/overlay.service.stub';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: Store<AppState>;

  const moduleDef: TestModuleMetadata = {
    declarations: [
      SearchComponent
    ],
    imports: [
      SharedModule,
      BrowserAnimationsModule,
      TranslateStubModule,
      ReactiveFormsModule,
      StoreModule.forRoot({'mediaLibrary': combineReducers(fromMediaLibrary.reducers)}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      })
    ],
    providers: [
      { provide: OverlayService, useClass: OverlayServiceStub }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action when the texbox changes', fakeAsync(() => {
    component.searchBox.setValue('name');
    tick(300); // It must to be the same value of debounceTime
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new SearchActions.SetSearchTerms('name'));
  }));
});
