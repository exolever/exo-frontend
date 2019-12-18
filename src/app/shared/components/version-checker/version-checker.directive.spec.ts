import {TestBed} from '@angular/core/testing';
import {VersionCheckerDirective} from './version-checker.directive';
import {TranslateStubModule} from '@testing/modules/translate-stub.module';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {PromptDialogService} from '@shared/modules/prompt-dialog/prompt-dialog.service';
import {PromptDialogServiceStub} from '@shared/modules/prompt-dialog/prompt-dialog.service.stub';
import {SessionStorageServiceStub} from '@core/services/stubs/session-storage-service-stub';
import {SessionStorageService} from '@core/services/sessionStorage.service';
import {By} from '@angular/platform-browser';

@Component({
  selector: 'my-test-component',
  template: ''
})
class TestComponent {}

describe('VersionCheckerDirective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateStubModule
      ],
      declarations: [
        TestComponent,
        VersionCheckerDirective
      ],
      providers: [
        {provide: PromptDialogService, useClass: PromptDialogServiceStub},
        {provide: SessionStorageService, useClass: SessionStorageServiceStub},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should be able to test directive', () => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: '<div versionChecker></div>'
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const directiveEl = fixture.debugElement.query(By.directive(VersionCheckerDirective));
      expect(directiveEl).not.toBeNull();
      const directiveInstance = directiveEl.injector.get(VersionCheckerDirective);
      expect(directiveInstance.unsupportedBrowser('Chrome 73')).toBeFalsy();
      expect(directiveInstance.unsupportedBrowser('Chrome 33')).toBeTruthy();
    });

  });
});
