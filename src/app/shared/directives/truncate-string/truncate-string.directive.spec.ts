import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { configTestBed } from '@testing/test.common.spec';
import { TruncateStringDirective } from '@shared/directives/truncate-string/truncate-string.directive';

@Component({
  template: `
    <p appTruncateString="60">Class-only tests might be helpful</p>
    <p appTruncateString="30">
      A better solution is to create an artificial test component that demonstrates all ways to apply the directive.
    </p>
    <p appTruncateString="50">
      However, testing a single use case is unlikely to explore the full range of a directive's capabilities
    </p>
  `
})
class TruncateTestComponent { }

describe('TruncateStringDirective', () => {

  let fixture: ComponentFixture<TruncateTestComponent>;
  let debugElements: DebugElement[];

  const moduleDef: TestModuleMetadata = {
    declarations: [
      TruncateTestComponent,
      TruncateStringDirective
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(TruncateTestComponent);
    fixture.detectChanges();
    debugElements = fixture.debugElement.queryAll(By.directive(TruncateStringDirective));
  });

  it('Should have 3 directives', () => {
    expect(debugElements.length).toBe(3);
  });

  it('Should show all text without truncate', () => {
    expect(debugElements[0].nativeElement.textContent).toEqual('Class-only tests might be helpful');
  });

  it('Should truncate at 30 characters', () => {
    expect(debugElements[1].attributes.appTruncateString).toEqual('30');
    expect(debugElements[1].nativeElement.textContent.trim()).toEqual('A better solution is to cre...');
    expect(debugElements[1].nativeElement.textContent.trim().length).toBe(30);
  });

  it('Should truncate at 50 characters', () => {
    expect(debugElements[2].attributes.appTruncateString).toEqual('50');
    expect(debugElements[2].nativeElement.textContent.trim())
      .toEqual('However, testing a single use case is unlikely ...');
    expect(debugElements[2].nativeElement.textContent.trim().length).toBe(50);
  });
});
