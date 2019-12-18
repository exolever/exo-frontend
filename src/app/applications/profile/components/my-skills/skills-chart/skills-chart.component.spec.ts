import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { ɵMockMatchMediaProvider } from '@angular/flex-layout';

import { PolarChartModule } from '@swimlane/ngx-charts';

import { configTestBed } from '@testing/test.common.spec';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { FakeConsultantFactory } from '@applications/shared/faker_factories/consultant-fake.model';
import { ObservableMediaMockProvider } from '@testing/mocks/flex-layout.mocks';
import { WindowRef } from '@app/core';

import { SkillsChartComponent } from './skills-chart.component';

describe('SkillsChartComponent', () => {
  let component: SkillsChartComponent;
  let fixture: ComponentFixture<SkillsChartComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
      PolarChartModule
    ],
    declarations: [SkillsChartComponent],
    providers: [
      ɵMockMatchMediaProvider,
      ObservableMediaMockProvider,
      WindowRef
    ]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsChartComponent);
    component = fixture.componentInstance;
    component.profileUser = new FakeConsultantFactory().modelPropertiesCustom();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
