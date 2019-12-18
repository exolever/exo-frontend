import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { UrlService } from '@app/core';
import { UrlServiceStub } from '@core/services/stubs';
import { configTestBed } from '@testing/test.common.spec';
import { AppState } from '@core/store/reducers';

import * as fromMediaLibrary from '../store/reducers';
import { MediaLibraryWebsocketService } from './real-time.service';

describe('MediaLibraryWebsocketService', () => {
  let store: Store<AppState>;
  let rtService: MediaLibraryWebsocketService;

  const moduleDef: TestModuleMetadata = {
    imports: [
      StoreModule.forRoot({'mediaLibrary': combineReducers(fromMediaLibrary.reducers)})
    ],
    providers: [
      { provide: UrlService, useClass: UrlServiceStub },
      MediaLibraryWebsocketService
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    store = TestBed.get(Store);
    rtService = TestBed.get(MediaLibraryWebsocketService);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should be created', () => {
    expect(rtService).toBeTruthy();
  });

});
