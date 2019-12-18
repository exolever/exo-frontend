import { TestBed, inject, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { of as observableOf } from 'rxjs';

import { configTestBed } from '@testing/test.common.spec';
import { UrlService } from '@app/core';
import { UrlServiceStub } from '@core/services/stubs';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { AuthServiceStub } from '@testing/stubs/auth-service-stub';
import { IFilter } from '@shared/components/filter/filter.component';

import { FilterOptionsService } from './filter.service';

describe('FilterOptionsService', () => {
  let filterService: FilterOptionsService;
  let authHttp: AuthServiceStub;
  let mockData;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule,
      HttpClientTestingModule
    ],
    providers: [
      FilterOptionsService,
      {
        provide: HttpClient,
        useClass: AuthServiceStub
      },
      { provide: UrlService, useClass: UrlServiceStub }
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    filterService = TestBed.get(FilterOptionsService);
    authHttp = TestBed.get(HttpClient);

    mockData = [
      { 'name': '3D displays', 'slug': '3d-displays', 'categorySlug': 'technologies', 'defaultShowFilter': false },
      { 'name': '5G', 'slug': '5g', 'categorySlug': 'technologies', 'defaultShowFilter': false },
      { 'name': 'Accommodations', 'slug': 'accommodations', 'categorySlug': 'industries', 'defaultShowFilter': true },
      { 'name': 'Accounting', 'slug': 'accounting', 'categorySlug': 'industries', 'defaultShowFilter': false }
    ];
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });

  it('getFilters return an observable with right data', () => {
    const spyBack = spyOn(authHttp, 'get').and.returnValue(
      observableOf(mockData)
    );
    const results: IFilter[] = [
      {
        name: 'technologies',
        slug: 'technologies',
        dirty: false,
        options: [
          {
            pk: 'technologies',
            name: 'All',
            selected: true,
            showByDefault: true,
            optionsToUnmark: [ '3d-displays', '5g' ] },
          {
            pk: '3d-displays',
            name: '3D displays',
            selected: false,
            showByDefault: false,
            optionsToUnmark: [ 'technologies' ]
          },
          {
            pk: '5g',
            name: '5G',
            selected: false,
            showByDefault: false,
            optionsToUnmark: [ 'technologies' ]
          }
        ]
      },
      {
        name: 'industries',
        slug: 'industries',
        dirty: false,
        options: [
          {
            pk: 'industries',
            name: 'All',
            selected: true,
            showByDefault: true,
            optionsToUnmark: [ 'accommodations', 'accounting' ]
          },
          {
            pk: 'accommodations',
            name: 'Accommodations',
            selected: false,
            showByDefault: true,
            optionsToUnmark: [ 'industries' ]
          },
          {
            pk: 'accounting',
            name: 'Accounting',
            selected: false,
            showByDefault: false,
            optionsToUnmark: [ 'industries' ]
          }
        ]
      }
    ];

    filterService.getFilters().subscribe(resp =>
      expect(resp).toEqual(results)
    );

    expect(spyBack).toHaveBeenCalled();
  });

  it('getFilters make a request to the backend', inject([UrlService], (urlService: UrlService) => {
    const spy = spyOn(urlService, 'resolveMediaLibrary').and.returnValue('');
    const spyBack = spyOn(authHttp, 'get').and.returnValue(
      observableOf(mockData)
    );

    filterService.getFilters().subscribe();

    expect(spy).toHaveBeenCalled();
    expect(spyBack).toHaveBeenCalled();
  }));

  it('getTags make a request to the backend', inject([UrlService], (urlService: UrlService) => {
    const spy = spyOn(urlService, 'resolveMediaLibrary').and.returnValue('');
    const spyBack = spyOn(authHttp, 'get').and.returnValue(
      observableOf(mockData)
    );

    filterService.getTags().subscribe();

    expect(spy).toHaveBeenCalled();
    expect(spyBack).toHaveBeenCalled();
  }));

});
