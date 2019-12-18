import {TestBed} from '@angular/core/testing';
import {TranslateStubModule} from '@testing/modules/translate-stub.module';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {PromptDialogService} from '@shared/modules/prompt-dialog/prompt-dialog.service';
import {PromptDialogServiceStub} from '@shared/modules/prompt-dialog/prompt-dialog.service.stub';
import {SessionStorageServiceStub} from '@core/services/stubs/session-storage-service-stub';
import {SessionStorageService} from '@core/services/sessionStorage.service';
import {By} from '@angular/platform-browser';
import {
  MIN_RESOLUTION,
  ResolutionCheckerDirective
} from '@shared/components/resolution-checker/resolution-checker.directive';
import { WindowRef } from '@app/core';

@Component({
  selector: 'my-test-component',
  template: ''
})
class TestComponent {
}

describe('ResolutionCheckerDirective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateStubModule
      ],
      declarations: [
        TestComponent,
        ResolutionCheckerDirective
      ],
      providers: [
        WindowRef,
        {provide: PromptDialogService, useClass: PromptDialogServiceStub},
        {provide: SessionStorageService, useClass: SessionStorageServiceStub},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should be able to test directive', () => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: '<div resolutionChecker></div>'
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const directiveEl = fixture.debugElement.query(By.directive(ResolutionCheckerDirective));
      expect(directiveEl).not.toBeNull();
      const directiveInstance = directiveEl.injector.get(ResolutionCheckerDirective);
      let screenWidth = 254;
      expect(screenWidth < MIN_RESOLUTION).toBeTruthy();
      screenWidth = directiveInstance.w.nativeWindow.innerWidth;
      expect(screenWidth < MIN_RESOLUTION).toBeFalsy();
    });

  });
});
