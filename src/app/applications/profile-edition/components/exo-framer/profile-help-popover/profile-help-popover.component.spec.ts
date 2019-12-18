import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configTestBed } from '@testing/test.common.spec';
import { SharedModule } from '@shared/shared.module';
import { MatPopoverModule } from '@shared/components/popover';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';

import { ProfileHelpPopoverComponent } from './profile-help-popover.component';

describe('ChartHelpPopoverComponent', () => {
  let component: ProfileHelpPopoverComponent;
  let fixture: ComponentFixture<ProfileHelpPopoverComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      SharedModule,
      MatPopoverModule,
      TranslateStubModule
    ],
    declarations: [ProfileHelpPopoverComponent],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHelpPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
