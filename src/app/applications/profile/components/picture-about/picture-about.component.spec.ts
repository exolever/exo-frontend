import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatDialog } from '@angular/material';

import { configTestBed } from '@testing/test.common.spec';
import { FakeConsultantFactory } from '@applications/shared/faker_factories';
import { URL_SERVICE_STUB_PROVIDER, USER_SERVICE_STUB_PROVIDER } from '@core/services/stubs';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';

import { PictureAboutComponent } from './picture-about.component';
import { ProfileConsultantRolesService } from '../../services/profile-consultant-roles.service';
import { ProfileViewConfigProvider } from '../../profile-view.config';
import { ProfileEditButtonComponent } from '../../common/profile-edit-button/profile-edit-button.component';

describe('PictureAboutComponent', () => {
  let component: PictureAboutComponent;
  let fixture: ComponentFixture<PictureAboutComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    declarations: [
      PictureAboutComponent,
      ProfileEditButtonComponent
    ],
    providers: [
      MatDialog,
      ProfileViewConfigProvider,
      ProfileConsultantRolesService,
      URL_SERVICE_STUB_PROVIDER,
      USER_SERVICE_STUB_PROVIDER,
      ChangeDetectorRef
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureAboutComponent);
    component = fixture.componentInstance;
    component.profileUser = new FakeConsultantFactory().modelPropertiesCustom();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
