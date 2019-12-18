import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { configTestBed } from '@testing/test.common.spec';
import { LocalStorageServiceStub, UrlServiceStub } from '@core/services/stubs';
import { LocalStorageService, UrlService } from '@app/core';
import { ApplicationsComponent } from '@applications/applications.component';

describe('Applications component', () => {

  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [
      RouterTestingModule
    ],
    declarations: [
      ApplicationsComponent
    ],
    providers: [
      { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      { provide: UrlService, useClass: UrlServiceStub }
    ],
    schemas: [NO_ERRORS_SCHEMA],
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
