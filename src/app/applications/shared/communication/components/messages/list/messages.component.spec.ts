import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configTestBed } from '@testing/test.common.spec';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { ListMessagesComponent } from '@applications/shared/communication/components/messages/list/messages.component';

describe('Communication MessagesComponent', () => {
  let component: ListMessagesComponent;
  let fixture: ComponentFixture<ListMessagesComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      MatMenuModule,
      TranslateStubModule,
    ],
    declarations: [ ListMessagesComponent ],
    schemas: [NO_ERRORS_SCHEMA],
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
