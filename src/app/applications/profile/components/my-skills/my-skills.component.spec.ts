import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { PolarChartModule } from '@swimlane/ngx-charts';

import { configTestBed } from '@testing/test.common.spec';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { FakeConsultantFactory } from '@applications/shared/faker_factories/consultant-fake.model';
import { WindowRef } from '@app/core';

import { ProfileViewConfigProvider } from '../../profile-view.config';
import { MySkillsComponent } from './my-skills.component';
import { SkillsChartComponent } from './skills-chart/skills-chart.component';
import { ProfileEditButtonComponent } from '../../common/profile-edit-button/profile-edit-button.component';

describe('MySkillsComponent', () => {
  let component: MySkillsComponent;
  let fixture: ComponentFixture<MySkillsComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
      PolarChartModule,
    ],
    declarations: [
      MySkillsComponent,
      SkillsChartComponent,
      ProfileEditButtonComponent,
    ],
    providers: [ProfileViewConfigProvider, WindowRef],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(MySkillsComponent);
    component = fixture.componentInstance;
    component.profileUser = new FakeConsultantFactory().modelPropertiesCustom();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
