import { TestBed, inject, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { of as observableOf } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';

import { UrlService } from '@app/core';
import { UrlServiceStub } from '@core/services/stubs';
import { PaginationModel } from '@applications/shared/models';
import { AuthServiceStub } from '@testing/stubs/auth-service-stub';
import { configTestBed } from '@testing/test.common.spec';
import { pipeDoubleExpectedCallAmount } from '@testing/ngrx/ngrx-helpers';
import { AppState } from '@core/store/reducers';

import * as fromMediaLibrary from '../store/reducers';
import { Resource, ResourceStatus, ResourceType } from '../store/resource.model';
import { LIBRARY_CONFIG, mediaLibraryConfig} from '../ecosystem-media-library.conf';
import { ResourcesService } from './resources.service';

describe('ResourcesService', () => {
  let store: Store<AppState>;
  let searchService: ResourcesService;
  let authHttp: AuthServiceStub;

  const moduleDef: TestModuleMetadata = {
    imports: [
      HttpClientTestingModule,
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
    providers: [
      ResourcesService,
      { provide: HttpClient, useClass: AuthServiceStub },
      { provide: UrlService, useClass: UrlServiceStub },
      { provide: LIBRARY_CONFIG, useValue: mediaLibraryConfig }
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    store = TestBed.get(Store);
    searchService = TestBed.get(ResourcesService);
    authHttp = TestBed.get(HttpClient);

    spyOn(store, 'pipe').and.callThrough();
  });

  it('should be created', () => {
    expect(searchService).toBeTruthy();
  });

  it('should call the store when you make a request', () => {
    const spyBack = spyOn(authHttp, 'get').and.returnValue(
      observableOf(new PaginationModel(0, '0', '0', []))
    );

    searchService.getResources().subscribe();

    expect(store.pipe).toHaveBeenCalledTimes(pipeDoubleExpectedCallAmount(1));
    expect(spyBack).toHaveBeenCalled();
  });

  it('getResources make a request to the backend', inject([UrlService], (urlService: UrlService) => {
    const spy = spyOn(urlService, 'resolveMediaLibrary').and.returnValue('');
    const spyBack = spyOn(authHttp, 'get').and.returnValue(
      observableOf(new PaginationModel(0, '0', '0', []))
    );

    searchService.getResources().subscribe();

    expect(spy).toHaveBeenCalled();
    expect(spyBack).toHaveBeenCalled();
  }));

  it('checkUrl make a request to the backend', inject([UrlService], (urlService: UrlService) => {
    const spy = spyOn(urlService, 'resolveMediaLibrary').and.returnValue('');
    const spyBack = spyOn(authHttp, 'post').and.returnValue(observableOf(true));

    searchService.checkURL('http://example.com').subscribe();

    expect(spy).toHaveBeenCalled();
    expect(spyBack).toHaveBeenCalled();
  }));

  it('delete make a request to the backend', inject([UrlService], (urlService: UrlService) => {
    const spy = spyOn(urlService, 'resolveMediaLibrary').and.returnValue('');
    const spyBack = spyOn(authHttp, 'delete').and.returnValue(observableOf(true));

    const resource = <Resource>{pk: '1'};
    searchService.delete(resource).subscribe();

    expect(spy).toHaveBeenCalled();
    expect(spyBack).toHaveBeenCalled();
  }));

  it('update make a request to the backend', inject([UrlService], (urlService: UrlService) => {
    const spy = spyOn(urlService, 'resolveMediaLibrary').and.returnValue('');
    const spyBack = spyOn(authHttp, 'put').and.returnValue(observableOf(new Resource({
        pk: '1',
        name: 'name',
        type: ResourceType.Video,
        tags: [],
        status: ResourceStatus.Available
      })
    ));

    const params = {};
    searchService.update(params).subscribe();

    expect(spy).toHaveBeenCalled();
    expect(spyBack).toHaveBeenCalled();
  }));

  it('upload make a request to the backend', inject([UrlService], (urlService: UrlService) => {
    const spy = spyOn(urlService, 'resolveMediaLibrary').and.returnValue('');
    const spyBack = spyOn(authHttp, 'post').and.returnValue(observableOf(new Resource({
        pk: '1',
        name: 'name',
        type: ResourceType.Video,
        tags: [],
        status: ResourceStatus.Available
      })
    ));

    const params = {};
    searchService.upload(params).subscribe();

    expect(spy).toHaveBeenCalled();
    expect(spyBack).toHaveBeenCalled();
  }));
});
