import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '@testing/test.common.spec';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { FakeConsultantFactory } from '@applications/shared/faker_factories/consultant-fake.model';

import { CorePillarsComponent } from './core-pillars.component';
import { ProfileViewConfigProvider } from '../../profile-view.config';
import { ProfileEditButtonComponent } from '../../common/profile-edit-button/profile-edit-button.component';

describe('CorePillarsComponent', () => {
  let component: CorePillarsComponent;
  let fixture: ComponentFixture<CorePillarsComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
    ],
    declarations: [
      CorePillarsComponent,
      ProfileEditButtonComponent
    ],
    providers: [ProfileViewConfigProvider],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(CorePillarsComponent);
    component = fixture.componentInstance;
    component.profileUser = new FakeConsultantFactory().modelPropertiesCustom();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
