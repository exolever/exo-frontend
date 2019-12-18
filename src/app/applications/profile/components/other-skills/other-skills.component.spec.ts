import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configTestBed } from '@testing/test.common.spec';
import { SharedModule } from '@shared/shared.module';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';

import { ProfileViewConfigProvider } from '../../profile-view.config';
import { OtherSkillsComponent } from './other-skills.component';

describe('OtherSkillsComponent', () => {
  let component: OtherSkillsComponent;
  let fixture: ComponentFixture<OtherSkillsComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      NoopAnimationsModule,
      TranslateStubModule
    ],
    declarations: [OtherSkillsComponent],
    providers: [ProfileViewConfigProvider],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSkillsComponent);
    component = fixture.componentInstance;
    component.skills = [{ label: 'something', data: [] }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
