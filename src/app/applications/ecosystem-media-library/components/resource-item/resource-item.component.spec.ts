import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { combineReducers, StoreModule } from '@ngrx/store';

import { configTestBed } from '@testing/test.common.spec';
import { FilestackService } from '@core/services/filestack.service';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { ExoCommonModule } from '@shared/exo-common.module';
import * as fromStep from '@applications/service/old-project/store/reducers';

import { ResourceItemComponent } from '../resource-item/resource-item.component';
import { Resource, ResourceStatus, ResourceType } from '../../store/resource.model';
import {PromptDialogService} from '@shared/modules/prompt-dialog/prompt-dialog.service';
import {PromptDialogServiceStub} from '@shared/modules/prompt-dialog/prompt-dialog.service.stub';

describe('ResourceItemComponent', () => {
  let component: ResourceItemComponent;
  let fixture: ComponentFixture<ResourceItemComponent>;

  const resource: Resource = new Resource({
    pk: '1',
    type: ResourceType.Video,
    status: ResourceStatus.Available,
    description: 'Video, 01:23',
    thumbnail: 'http://via.placeholder.com/72x72',
    name: 'Title from my fake video',
  });

  const moduleDef: TestModuleMetadata = {
    imports: [
      ExoCommonModule,
      TranslateStubModule,
      StoreModule.forRoot({'service': combineReducers(fromStep.reducers, {})}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      })
    ],
    declarations: [
      ResourceItemComponent
    ],
    providers: [
      { provide: FilestackService, useValue: { init() {}}},
      { provide: PromptDialogService, useClass: PromptDialogServiceStub },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceItemComponent);
    component = fixture.componentInstance;
    component.resource = resource;
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should has the icon arrows-alt', () => {
    expect(component.thumbnailIcon).toBe('fa-arrows-alt');
  });

  it('Should render a figure with an image and icon', () => {
    const de = fixture.debugElement.query(By.css('.tool-thumbnail'));
    expect(de.name).toBe('figure');

    expect(de.children[0].name).toBe('img');
    expect(de.children[1].name).toBe('a');
  });

  it('Should render a title', () => {
    const de = fixture.debugElement.query(By.css('.tool-title'));
    expect(de.nativeElement.innerHTML).toContain('Title from my fake video');
  });

  it('Should render a caption', () => {
    const de = fixture.debugElement.query(By.css('.tool-caption'));
    expect(de.nativeElement.innerHTML).toContain('Video');
  });

  it('Shouldn\'t render a menu with the actions', () => {
    const de = fixture.debugElement.query(By.css('.tool-options'));
    expect(de).toBeFalsy();
    expect(de).toBeNull();
  });

});
