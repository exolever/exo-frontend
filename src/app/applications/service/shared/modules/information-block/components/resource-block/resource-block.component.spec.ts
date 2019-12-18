/*
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  ResourceBlockComponent
} from './resource-block.component';
import { InformationBlockType } from '@services/modules/information-block/models';
import { Resource, ResourceStatus, ResourceType } from '@ecosystem-media-library/store/resource.model';
import { configTestBed } from '@testing/test.common.spec';
import { TranslateStubModule } from '@testing/translate-stub.module';
import { TranslateService } from '@ngx-translate/core';


describe('ResourceBlockComponent', () => {
  let component: ResourceBlockComponent;
  let fixture: ComponentFixture<ResourceBlockComponent>;

  const resourcesBlock = {
    pk: '8',
    title: 'Test Resources blocks title',
    order: 7,
    type: InformationBlockType.Resource,
    contents: [
      <Resource>{
        pk: '1',
        type: ResourceType.Video,
        status: ResourceStatus.Available,
        name: 'This is a very long title for a video',
        description: 'Video, 03:45',
        thumbnail: 'http://via.placeholder.com/72x72'
      },
    ]
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule
    ],
    declarations: [
      ResourceBlockComponent
    ],
    providers: [
      { provide: TranslateService, useClass: TranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceBlockComponent);
    component = fixture.componentInstance;
    component.resourceBlock = resourcesBlock;
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should has a h2 with a title', () => {
    const de = fixture.debugElement.query(By.css('h2'));
    expect(de.nativeElement).toBeTruthy();
    expect(de.nativeElement.textContent).toContain('Test Resources blocks title');
  });

  it('Should has a div with flexLayout and an array of resource-items', () => {
    const de = fixture.debugElement.query(By.css('div.resources-container'));
    expect(de.nativeElement).toBeTruthy();
    expect(de.attributes.fxLayout).toEqual('row wrap');

    expect(de.children.length).toBe(1);
    expect(de.children[0].name).toBe('app-resource-item');
  });

});
*/
