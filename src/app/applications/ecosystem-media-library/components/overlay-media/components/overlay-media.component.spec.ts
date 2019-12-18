import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ExoCommonModule } from '@shared/exo-common.module';
import { PipeModule } from '@shared/pipes/pipes.module';
import { OverlayMediaReference } from '@ecosystem-media-library/components/overlay-media/overlay-media-ref';
import { VIDEO_DIALOG_DATA } from '@ecosystem-media-library/components/overlay-media/overlay-media.conf';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { OverlayMediaComponent } from './overlay-media.component';

describe('OverlayMediaComponent', () => {
  let component: OverlayMediaComponent;
  let fixture: ComponentFixture<OverlayMediaComponent>;

  const dataDialog = {
    fromAssignments: false,
    video: {pk: '1', name: 'titulo video', status: 'A', type: 'Video'}
  };

  const moduleDef: TestModuleMetadata = {
    declarations: [
      OverlayMediaComponent,
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      ExoCommonModule,
      PipeModule,
      TranslateStubModule
    ],
    providers: [
      { provide: OverlayMediaReference, useValue: {} },
      { provide: VIDEO_DIALOG_DATA, useValue: dataDialog }
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
