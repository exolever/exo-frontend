import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, inject, TestModuleMetadata } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ActivatedRouteStub } from '@testing/stubs/router-stubs';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { configTestBed } from '@testing/test.common.spec';

import { ShowAlertMessage } from './alert-message-configuration';

@Component({
  selector: '',
  template: `<div id='showAlert' *ngIf="showAlert">{{statusMessage}}</div>`
})
class StubAlertMessageComponent extends ShowAlertMessage {
  constructor(
    protected route: ActivatedRoute,
    protected translate: TranslateService,
  ) {
    super(route, translate);
  }
}

describe('AlertMessageComponent', () => {
  let component: StubAlertMessageComponent;
  let fixture: ComponentFixture<StubAlertMessageComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(() => {
    activatedRoute.queryParams = observableOf({ code: 'AuthFailed', message: '' });
  });

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule
    ],
    declarations: [
      StubAlertMessageComponent
    ],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(StubAlertMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show AuthFailed message', inject([TranslateService], (translateService: TranslateService) => {
    expect(component.showAlert).toBeTruthy();
    expect(component.getAlertMessage()).toBe(translateService.instant('PUBLIC.ERROR_MESSAGES.AUTH_FAILED'));
  }));

  it('should have message in html', (() => {
    expect(fixture.debugElement.query(By.css('#showAlert'))).toBeTruthy();
  }));

});
