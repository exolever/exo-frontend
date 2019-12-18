import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';

import { configTestBed } from '@testing/test.common.spec';
import { WindowRef } from '@app/core';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { matDialogRefStubProvider } from '@testing/stubs/mat-dialog-ref-stub';

import { ShareSurveyDialogComponent } from './share-survey-dialog.component';
import {CopyToClipboardService} from '@profile/services/copy-to-clipboard.service';

describe('ShareSurveyDialogComponent', () => {
  let component: ShareSurveyDialogComponent;
  let fixture: ComponentFixture<ShareSurveyDialogComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    declarations: [ShareSurveyDialogComponent],
    providers: [
      matDialogRefStubProvider,
      CopyToClipboardService,
      WindowRef,
      { provide: MAT_DIALOG_DATA, useValue: { url: 'http://test.com/' } }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSurveyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
