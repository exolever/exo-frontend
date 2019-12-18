import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { AgreementDialogComponent } from './agreement-dialog.component';
import { FakeAgreementInvitationFactory } from '../../../faker_factories/agreement-invitation-fake.model';

describe('AgreementDialogComponent', () => {
  let component: AgreementDialogComponent;
  let fixture: ComponentFixture<AgreementDialogComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule
    ],
    declarations: [
      AgreementDialogComponent
    ],
    providers: [
      { provide: MatDialogRef, useValue: {} }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementDialogComponent);
    component = fixture.componentInstance;
    component.agreementInvitation = new FakeAgreementInvitationFactory();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should to show declined button', () => {
    let declineButton: DebugElement = fixture.debugElement.query(By.css('#declineAgreement'));
    expect(declineButton).toBeNull();

    const agreementDeclineButton: DebugElement = fixture.debugElement.query(By.css('#decline'));
    expect(agreementDeclineButton).not.toBeNull();

    agreementDeclineButton.nativeElement.click();
    fixture.detectChanges();
    declineButton = fixture.debugElement.query(By.css('#declineAgreement'));
    expect(declineButton).not.toBeNull();
  });

});
