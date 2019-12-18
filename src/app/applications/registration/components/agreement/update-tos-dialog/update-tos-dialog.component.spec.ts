import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';

import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';
import {
  FakeAgreementInvitationFactory
} from '@applications/registration/faker_factories/agreement-invitation-fake.model';

import { UpdateTOSDialogComponent } from './update-tos-dialog.component';

describe('UpdateTOSDialogComponent', () => {
  let component: UpdateTOSDialogComponent;
  let fixture: ComponentFixture<UpdateTOSDialogComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule,
      RouterTestingModule
    ],
    declarations: [
      UpdateTOSDialogComponent,
    ],
    providers: [
      URL_SERVICE_STUB_PROVIDER,
      { provide: MatDialogRef, useValue: {} },
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTOSDialogComponent);
    component = fixture.componentInstance;
    component.agreementInvitation = new FakeAgreementInvitationFactory();

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('getFilename() works', () => {
    expect(component.getFilename('/hello%20world.pdf')).toBe('hello world.pdf');
    expect(component.getFilename('/hello world.pdf')).toBe('hello world.pdf');
  });
});
