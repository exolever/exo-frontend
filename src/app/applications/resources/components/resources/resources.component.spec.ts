import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule, MatDialogModule, MatChipsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { ResourcesComponent } from './resources.component';
import { IAddResource, IListResource, IDeleteResource, IResource } from '../../shared/models/';
import { ConfigAddResources, ConfigListResources } from '../../shared/config';
import { ResourcesService } from '../../shared/services';
import { FakeResourceFactory } from '../../shared/faker_factories';
import { globalResourceConfig, RESOURCES_CONFIG } from '../../resource.config.service';

describe('ResourcesComponent', () => {
  let component: ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

  class StubResourceService {
    getResources() {
      return true;
    }
  }

  class FakeModelResource implements IAddResource, IListResource, IDeleteResource {

    getApiData() {
      return [{ name: 'test', data: '' }];
    }

    addResource(resource: IResource) {
      return resource;
    }

    deleteResource() {}

    undoResource(resource: IResource) {}

    getSlug() {
      return '';
    }

    getResources(): Array<IResource> {
      return [new FakeResourceFactory()];
    }

    hasResources(): boolean {
      return true;
    }
  }

  const moduleDef: TestModuleMetadata = {
    imports: [
      MatSnackBarModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatChipsModule,
      TranslateStubModule
    ],
    declarations: [
      ResourcesComponent,
    ],
    providers: [
      { provide: ResourcesService, useClass: StubResourceService },
      { provide: RESOURCES_CONFIG, useValue: globalResourceConfig }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesComponent);
    component = fixture.componentInstance;
    component.dataModelListResource = new FakeModelResource();
    component.dataModelAddResource = new FakeModelResource();
    component.configAddResource = [new ConfigAddResources];
    component.configListResources = new ConfigListResources();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
