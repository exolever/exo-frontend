import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '@testing/test.common.spec';
import { FakeConsultantFactory } from '@applications/shared/faker_factories/consultant-fake.model';

import { VideoMeComponent } from './video-me.component';
import { VideoDisplayComponent } from './video-display/video-display.component';
import {TestingUtilityModule} from '@testing/modules/testing-utility.module';

describe('VideoMeComponent', () => {
  let component: VideoMeComponent;
  let fixture: ComponentFixture<VideoMeComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    declarations: [
      VideoMeComponent,
      VideoDisplayComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoMeComponent);
    component = fixture.componentInstance;
    component.profileUser = new FakeConsultantFactory().modelPropertiesCustom();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle read more boolean', () => {
    const initialValue = component.readMore;
    component.onReadMoreToggle();

    expect(component.readMore).toBe(!initialValue);
  });

});
