import { ComponentFixture, TestBed, TestModuleMetadata} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { FakeOpportunityApplicantFactory } from '@opportunities/faker_factories/opportunityApplicantFake.model';
import { configTestBed } from '@testing/test.common.spec';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  const applicant = new FakeOpportunityApplicantFactory();
  applicant.user.profilePictures = [
    {height: 24, width: 24, url: '/media/avatars/24_24/2d73545e21223fb76aaed3ca43857612.png' },
    {height: 48, width: 48, url: '/media/avatars/48_48/2d73545e21223fb76aaed3ca43857612.png' },
    {height: 96, width: 96, url: '/media/avatars/96_96/2d73545e21223fb76aaed3ca43857612.png' },
    {height: 144, width: 144, url: '/media/avatars/144_144/2d73545e21223fb76aaed3ca43857612.png' }
  ];

  const moduleDef: TestModuleMetadata = {
    imports: [TestingUtilityModule],
    declarations: [ ConfirmationDialogComponent ],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      { provide: MAT_DIALOG_DATA, useValue: {
        title: '',
        typeAlert: '',
        message: '',
        applicant: applicant,
        action: ''
      }}
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
