import { ComponentFixture, TestBed, TestModuleMetadata} from '@angular/core/testing';

import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { configTestBed } from '@testing/test.common.spec';

import { ProfileEditButtonComponent } from './profile-edit-button.component';

describe('ProfileEditButtonComponent', () => {
  let component: ProfileEditButtonComponent;
  let fixture: ComponentFixture<ProfileEditButtonComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    declarations: [ProfileEditButtonComponent]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
