import { TestBed, fakeAsync, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as faker from 'faker';
import { of as observableOf } from 'rxjs';

import { UrlService } from '@core/services/api/resolve/urls';
import { UrlServiceStub } from '@core/services/stubs/api-service-stub';
import { configTestBed } from '@testing/test.common.spec';

import { IResource } from '../../models';
import { FakeResourceFactory } from '../../faker_factories';
import { ResourcesService } from '../resources.service';

describe('ResourcesServiceService ', () => {
  let resourcesService: ResourcesService;

  class StubResourcesService extends ResourcesService {}

  const moduleDef: TestModuleMetadata = {
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: UrlService,
        useClass: UrlServiceStub
      },
      {
        provide: ResourcesService,
        useClass: StubResourcesService,
        deps: [UrlService]
      }
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(() => {
    resourcesService = TestBed.get(ResourcesService);
  });


  it('should ...', () => {
    expect(resourcesService).toBeTruthy();
  });

  it('Upload resource to server', fakeAsync(() => {
    const spy = spyOn(resourcesService, 'upload').and.returnValue(
      observableOf({})
    );
    resourcesService.upload([]);
    expect(spy.calls.any()).toEqual(true);
    expect(spy.calls.count()).toEqual(1);
  }));
  it('Delete tags of resource', fakeAsync(() => {
    const spy = spyOn(resourcesService, 'deleteTags').and.returnValue(
      observableOf({})
    );
    const slugs = [];
    const resource: IResource = new FakeResourceFactory();
    slugs.push(faker.lorem.words(2).split(' ').join(','));
    resourcesService.deleteTags(resource, slugs);
    expect(spy.calls.any()).toEqual(true);
    expect(spy.calls.count()).toEqual(1);
  }));

  it('Add tags of resource', fakeAsync(() => {
    const spy = spyOn(resourcesService, 'addTags').and.returnValue(
      observableOf({})
    );
    const slugs = [];
    const resource: IResource = new FakeResourceFactory();
    slugs.push(faker.lorem.words(2).split(' ').join(','));
    resourcesService.addTags(resource, slugs);
    expect(spy.calls.any()).toEqual(true);
    expect(spy.calls.count()).toEqual(1);
  }));

  it('Reduce slugs for comma', () => {
    const slugs = [];
    slugs.push(faker.lorem.words(2).split(' ').join(','));
    slugs.push(faker.lorem.words(5).split(' ').join(','));
    slugs.push(faker.lorem.words(3).split(' ').join(','));
    const stringSlugs = resourcesService.reduceSlugs(slugs);
    expect(stringSlugs.split(',').length).toBe(10, 'Number of slugs that we send');
  });

});

